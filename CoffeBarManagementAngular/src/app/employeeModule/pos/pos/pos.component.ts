import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MenuService } from '../../../menu/menu.service';
import { GetCategories } from '../../../shared/models/getCategories';
import { GetProducts } from '../../../shared/models/getProducts';
import { CartProduct } from '../../../shared/models/cartProduct';
import { PosService } from '../pos.service';
import { SharedService } from '../../../shared/shared.service';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { FormGroup } from '@angular/forms';
import { GetTables } from '../../../shared/models/getTables';
import { environment } from '../../../../environments/environment.development';
import { CreateEmployeeOrder } from '../../../shared/models/createEmployeeOrderDto';
import { OrderProductsClient } from '../../../shared/models/orderProductsClient';
import { AccountService } from '../../../account/account.service';
import { Roles } from '../../../../dependencies/roles';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { auto } from '@popperjs/core';
import { OrderNoteData } from '../../../shared/models/orderNoteData';
import { ImageService } from '../../../shared/ImageService';
import { NewClientOrder } from '../../../shared/models/newClientOrder';
import { PosClosedReport } from '../../../shared/models/PosReport/PosCloseReport';
import { ReportPdfServiceService } from '../../../report-pdf-service.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-pos',
    templateUrl: './pos.component.html',
    styleUrl: './pos.component.css',
})
export class PosComponent implements OnInit {
    constructor(
        private menuService: MenuService,
        private posService: PosService,
        public sharedService: SharedService,
        public accountService: AccountService,
        public roles: Roles,
        private router: Router,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private reportService: ReportPdfServiceService
    ) {}
    menuCategories: GetCategories[] = [];
    menuProducts: GetProducts[] = [];
    allProducts: GetProducts[] = [];
    allProductsForCart: GetProducts[] = [];
    searchInput?: string;
    public localStorageList: CartProduct[] = [];
    totalToPay: number = 0;
    modifyCartProducts: CartProduct[] = [];
    modifyOrderId: number = 0;

    formGroup: FormGroup = new FormGroup({});
    allTables: GetTables[] = [];

    selectedValue: number = 0;

    faTrashCan = faTrashCan;
    faEdit = faEdit;

    orderNoteData: OrderNoteData = {} as OrderNoteData;

    posClosedReportData: PosClosedReport = {} as PosClosedReport;

    ngOnInit(): void {
        this.getMenuCategories();
        this.getAllProducts();
        this.localStorageList = this.posService.getCartProductsToList();
        this.getAllTables();
        this.checkModifyOrderExist();

        const state = history.state;
        if (state.tableId != null) {
            this.selectedValue = state.tableId;
        }

        this.updateTotal();
        //console.log(this.localStorageList)
    }

    changeStatus(status: boolean) {
        this.posService.changeOpenStatus(status).subscribe({
            next: (response: any) => {
                this.sharedService.showNotificationAndReload(true, 'Status changed', response.value.message, true);
                if(response.value.status == false){
                    this.getCloseStatusData(new Date())
                }
            },
            error: (e:any) => {
                this.sharedService.showNotification(false,'Error',e.error.value.message);
            },
        });
    }


    getCloseStatusData(date: Date) {
        if(confirm('If this is the final closure for the day press ok for fiscal closure!')){
            this.reportService.generateFiscalReportClosePos()
        }
        const presentDate = this.sharedService.convertDateToYYMMDD(date)
        this.sharedService.getClosePOSData(presentDate).subscribe({
            next: (response: any) => {
                this.posClosedReportData = {
                    name: response.name,
                    createdAt:new Date(response.createdAt),
                    forDay:new Date(response.forDay),
                    finishedOrdersCounter: response.finishedOrdersCounter,
                    canceledOrdersCounter: response.canceledOrdersCounter,
                    totalOrdersValue: response.totalOrdersValue,
                    employeesOrders: response.employeesOrders,
                    products: response.products,
                };
                console.log(this.posClosedReportData);
                
                if(this.posClosedReportData.finishedOrdersCounter != 0){
                    this.reportService.generateClosePosReportPdf(this.posClosedReportData)
                }
                else{
                    this.sharedService.showNotification(false,'Error','There are no orders for today yep');
                }
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    checkModifyOrderExist() {
        this.modifyCartProducts = this.posService.getModifyCartProductsToList();
        const orderId = localStorage.getItem(environment.modifyingOrderId);
        if (orderId) {
            this.modifyOrderId = parseInt(orderId);
        }
    }

    newOrder() {
        localStorage.removeItem(environment.modifyCartProducts);
        localStorage.removeItem(environment.modifyingOrderId);
        this.totalToPay = 0; // Explicitly reset totalToPay
        this.modifyCartProducts = [];
        location.reload();
    }

    updateTotal() {
        this.totalToPay = 0;
        if (this.modifyOrderId != 0) {
            this.modifyCartProducts = this.posService.getModifyCartProductsToList();
            for (let i of this.modifyCartProducts) {
                this.totalToPay += i.total;
            }
        } else {
            this.localStorageList = this.posService.getCartProductsToList();
            for (let i of this.localStorageList) {
                this.totalToPay += i.total;
            }
        }
    }

    // getSlides(): any[][] {
    //     const chunkSize = 5;
    //     const slides = [];
    //     for (let i = 0; i < this.menuCategories.length; i += chunkSize) {
    //         slides.push(this.menuCategories.slice(i, i + chunkSize));
    //     }
    //     return slides;
    // }

    getMenuProducts(categoryId: string) {
        //this.allProducts = [];
        const categoryIdInt = parseInt(categoryId);
        this.menuService.getProductsByCategory(categoryIdInt).subscribe({
            next: (response: any) => {
                this.menuProducts = response;
                //console.log(this.menuProducts);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getAllProducts() {
        this.menuProducts = [];
        this.posService.getAllProducts().subscribe({
            next: (response: any) => {
                this.allProducts = response;
                this.allProductsForCart = this.allProducts;
                //console.log(this.allProducts);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getMenuCategories() {
        this.menuService.getMenuCategories().subscribe({
            next: (response: any) => {
                this.menuCategories = response;
                //console.log(this.menuCategories);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    showSearchResults() {
        this.menuProducts = [];
        const searchTerm = this.searchInput?.toLowerCase();
        this.posService.getAllProducts().subscribe({
            next: (response: any) => {
                this.allProducts = response;
                if (searchTerm) {
                    this.allProducts = this.allProducts.filter((obj) => {
                        const idProduct = obj.productId.toString();
                        const nameProduct = obj.productName.toLowerCase();
                        return idProduct == searchTerm || nameProduct.includes(searchTerm);
                    });
                }
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    getAllTables() {
        this.sharedService.getAllTables().subscribe({
            next: (response: any) => {
                this.allTables = response;
                //console.log(this.allTables);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    addProductToCart(productId: number) {
        if (this.modifyOrderId != 0) {
            let productListStorage: CartProduct[] = [];
            productListStorage = this.posService.getModifyCartProductsToList();
            const productToModify = productListStorage.find((q) => q.productId == productId);
            if (productToModify) {
                const result = this.allProducts.find((q) => q.productId == productId);
                if (result) {
                    if (result.complexProduct == false && productToModify.quantity >= result.productAvailability) {
                        this.sharedService.showNotification(
                            false,
                            `To much ${productToModify.productName}`,
                            'The availability of this product is not enough!',
                        );
                    } else {
                        productToModify.quantity++;
                        productToModify.total = productToModify.quantity * productToModify.unitPrice;
                        this.posService.addModifyCartItemsToLocalStorage(productListStorage);
                        this.modifyCartProducts = this.posService.getModifyCartProductsToList();
                        this.updateTotal();
                    }
                } else {
                    this.sharedService.showNotification(false, 'Error', 'Product was not found!');
                }
            } else {
                let productToAdd: CartProduct;
                const availabilityProduct = this.allProducts.find((q) => q.productId == productId);
                if (availabilityProduct) {
                    if (availabilityProduct.complexProduct == false && availabilityProduct.productAvailability == 0) {
                        this.sharedService.showNotification(false, 'Out of stock', `Product ${availabilityProduct.productName} is out of stock!`);
                    } else {
                        const result = this.allProductsForCart.find((q) => q.productId == productId);
                        if (result) {
                            productToAdd = {
                                productId: result.productId,
                                productName: result.productName,
                                quantity: 1,
                                unitPrice: result.productPrice,
                                total: result.productPrice,
                                tva: result.tva,
                            };
                            productListStorage.push(productToAdd);
                            this.posService.addModifyCartItemsToLocalStorage(productListStorage);
                            this.modifyCartProducts = this.posService.getModifyCartProductsToList();
                            this.updateTotal();
                        } else {
                            this.sharedService.showNotification(false, 'Error', 'Something went wrong by adding this product!');
                        }
                    }
                } else {
                    this.sharedService.showNotification(false, 'Error', 'Product was not found!');
                }
            }
        } else {
            let productListStorage: CartProduct[] = [];
            productListStorage = this.posService.getCartProductsToList();
            const productToModify = productListStorage.find((q) => q.productId == productId);
            if (productToModify) {
                const result = this.allProducts.find((q) => q.productId == productId);
                if (result) {
                    if (result.complexProduct == false && productToModify.quantity >= result.productAvailability) {
                        this.sharedService.showNotification(
                            false,
                            `To much ${productToModify.productName}`,
                            'The availability of this product is not enough!',
                        );
                    } else {
                        productToModify.quantity++;
                        productToModify.total = productToModify.quantity * productToModify.unitPrice;
                        this.posService.addCartItemsToLocalStorage(productListStorage);
                        this.localStorageList = this.posService.getCartProductsToList();
                        this.updateTotal();
                    }
                } else {
                    this.sharedService.showNotification(false, 'Error', 'Product was not found!');
                }
            } else {
                let productToAdd: CartProduct;
                const availabilityProduct = this.allProducts.find((q) => q.productId == productId);
                if (availabilityProduct) {
                    if (availabilityProduct.complexProduct == false && availabilityProduct.productAvailability == 0) {
                        this.sharedService.showNotification(false, 'Out of stock', `Product ${availabilityProduct.productName} is out of stock!`);
                    } else {
                        const result = this.allProductsForCart.find((q) => q.productId == productId);
                        if (result) {
                            productToAdd = {
                                productId: result.productId,
                                productName: result.productName,
                                quantity: 1,
                                unitPrice: result.productPrice,
                                total: result.productPrice,
                                tva: result.tva,
                            };
                            productListStorage.push(productToAdd);
                            this.posService.addCartItemsToLocalStorage(productListStorage);
                            this.localStorageList = this.posService.getCartProductsToList();
                            this.updateTotal();
                        } else {
                            this.sharedService.showNotification(false, 'Error', 'Something went wrong by adding this product!');
                        }
                    }
                } else {
                    this.sharedService.showNotification(false, 'Error', 'Product was not found!');
                }
            }
        }
    }

    changeQuantity(productId: number, newQuantity: number) {
        if (newQuantity < 1) {
            this.sharedService.showNotification(false, 'Bad employee', 'Quantity must be greater than 1');
        } else {
            const result = this.allProducts.find((q) => q.productId == productId);
            if (result) {
                if (result.complexProduct == false && result.productAvailability < newQuantity) {
                    this.sharedService.showNotification(false, `To much ${result.productName}`, 'The availability of this product is not enough!');
                } else {
                    if (this.modifyOrderId != 0) {
                        const itemIndex = this.modifyCartProducts.findIndex((q) => q.productId == productId);
                        this.modifyCartProducts[itemIndex].quantity = newQuantity;
                        this.modifyCartProducts[itemIndex].total =
                            this.modifyCartProducts[itemIndex].quantity * this.modifyCartProducts[itemIndex].unitPrice;
                        //console.log(this.localStorageList[itemIndex].total);
                        this.posService.addModifyCartItemsToLocalStorage(this.modifyCartProducts);
                        this.sharedService.showNotification(true, ':D', `Quantity was changed to ${newQuantity}`);
                        this.updateTotal();
                    } else {
                        const itemIndex = this.localStorageList.findIndex((q) => q.productId == productId);
                        this.localStorageList[itemIndex].quantity = newQuantity;
                        this.localStorageList[itemIndex].total =
                            this.localStorageList[itemIndex].quantity * this.localStorageList[itemIndex].unitPrice;
                        //console.log(this.localStorageList[itemIndex].total);
                        this.posService.addCartItemsToLocalStorage(this.localStorageList);
                        this.sharedService.showNotification(true, ':D', `Quantity was changed to ${newQuantity}`);
                        this.updateTotal();
                    }
                }
            } else {
                this.sharedService.showNotification(false, 'Error', 'Product was not found!');
            }
        }
    }

    deleteItem(productId: number) {
        if (confirm('Are you sure about this?')) {
            if (this.modifyOrderId != 0) {
                const itemIndex = this.modifyCartProducts.findIndex((q) => q.productId == productId);
                this.modifyCartProducts.splice(itemIndex, 1);
                this.posService.addModifyCartItemsToLocalStorage(this.modifyCartProducts);
                //this.sharedService.showNotification(true, ':(', `Item was deleted!`);
                this.updateTotal();
            } else {
                const itemIndex = this.localStorageList.findIndex((q) => q.productId == productId);
                this.localStorageList.splice(itemIndex, 1);
                this.posService.addCartItemsToLocalStorage(this.localStorageList);
                //this.sharedService.showNotification(true, ':(', `Item was deleted!`);
                this.updateTotal();
            }
        }
    }

    getProducts(selectedValue: string) {
        if (selectedValue == 'all') {
            this.getAllProducts();
        } else {
            this.getMenuProducts(selectedValue);
        }
    }

    createOrder() {
        //console.log(1);

        if (this.modifyOrderId != 0) {
            if (this.modifyCartProducts.length > 0) {
                let model: OrderProductsClient[] = [];
                for (let item of this.modifyCartProducts) {
                    var productToAdd: OrderProductsClient = {
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    };
                    model.push(productToAdd);
                }
                //console.log(model);
                //console.log(this.modifyOrderId);

                let correctedModel: NewClientOrder = {
                    products: model,
                };

                this.posService.addNewProductsToOrder(this.modifyOrderId, correctedModel).subscribe({
                    next: (response: any) => {
                        this.sharedService.showNotificationAndReload(true, 'Success', response.value.message, true);
                        localStorage.removeItem(environment.modifyingOrderId);
                        localStorage.removeItem(environment.modifyCartProducts);
                        this.updateTotal();
                        this.reportService.generateOrderNotePDF(this.modifyOrderId);
                        this.modifyOrderId = 0;
                        this.modifyCartProducts = [];
                    },
                    error: (error: any) => {
                        this.sharedService.showNotificationAndReload(true, 'Success', error.error.value.message, false);
                    },
                });
            } else {
                this.sharedService.showNotification(false, 'Error', 'No products added to the cart!');
            }
        } else {
            const product: CartProduct[] = this.posService.getCartProductsToList();
            const orderProduct: OrderProductsClient[] = [];

            if (product.length > 0) {
                if (confirm('Are you sure about this?')) {
                    for (let item of product) {
                        const productToAdd: OrderProductsClient = {
                            productId: item.productId,
                            unitPrice: item.unitPrice,
                            quantity: item.quantity,
                        };
                        orderProduct.push(productToAdd);
                    }
                    let model: CreateEmployeeOrder = {
                        tableId: this.selectedValue,
                        products: orderProduct,
                    };
                    const userId = this.sharedService.getUserId();
                    console.log(userId);

                    if (userId) {
                        this.posService.createOrderEmployee(model, userId, false).subscribe({
                            next: (response: any) => {
                                localStorage.removeItem(environment.cartKey);
                                this.localStorageList = this.posService.getCartProductsToList();
                                this.sharedService.showNotification(true, 'Success', response.value.message);
                                this.reportService.generateOrderNotePDF(response.value.orderId);
                            },
                            error: (error: any) => {
                                this.sharedService.showNotification(false, 'Error ocurred', error.error.value.message);
                            },
                        });
                    }
                }
            } else {
                this.sharedService.showNotification(false, 'No products', 'There are no products added to the cart!');
            }
        }
    }

    createAndPay(tableIdForOrder: number) {
        if (this.modifyOrderId != 0) {
            const addedProducts: CartProduct[] = this.posService.getModifyCartProductsToList();
            if (addedProducts.length > 0) {
                const navigationExtras: NavigationExtras = {
                    state: {
                        tableIdForOrder,
                    },
                };
                //console.log('Navigating with state:', navigationExtras.state);
                this.router.navigate(['/employees', 'payment'], navigationExtras);
            } else {
                this.sharedService.showNotification(false, 'No products', 'There are no products added to the cart!');
            }
        } else {
            const product: CartProduct[] = this.posService.getCartProductsToList();
            if (product.length > 0) {
                const navigationExtras: NavigationExtras = {
                    state: {
                        tableIdForOrder,
                    },
                };
                //console.log('Navigating with state:', navigationExtras.state);
                this.router.navigate(['/employees', 'payment'], navigationExtras);
            } else {
                this.sharedService.showNotification(false, 'No products', 'There are no products added to the cart!');
            }
        }
    }

    // async generateOrderNotePDF(orderId: number) {
    //     this.sharedService.getOrderNote(orderId).subscribe({
    //         next: async (response: any) => {
    //             this.orderNoteData = {
    //                 organizationName: response.organizationName,
    //                 orderDate: new Date(response.orderDate),
    //                 tableId: response.tableId,
    //                 products: response.products,
    //                 employeeName: response.employeeName,
    //                 orderId: response.orderId,
    //                 orderStatus: response.orderStatus,
    //                 total: response.total,
    //             };
    //             let tableId: string = ' bar';
    //             if (this.orderNoteData.tableId >= 1) {
    //                 tableId = this.orderNoteData.tableId.toString();
    //             }
    //             const formatDate = (date: Date) => {
    //                 const options: Intl.DateTimeFormatOptions = {
    //                     weekday: 'short',
    //                     year: 'numeric',
    //                     month: 'short',
    //                     day: 'numeric',
    //                     hour: '2-digit',
    //                     minute: '2-digit',
    //                     second: '2-digit',
    //                     hour12: false,
    //                 };
    //                 return date.toLocaleDateString('en-US', options);
    //             };
    //             const formattedDate = formatDate(this.orderNoteData.orderDate);
    //             const pageSize = {
    //                 width: 350,
    //                 height: auto as any,
    //             };
    //             const base64Image = await this.imageService.convertImageToBase64(
    //                 '../../../../assets/images/sdbar-high-resolution-logo-black-transparent.png',
    //             );
    //             const productsTableBody = [
    //                 [
    //                     { text: 'Name', style: 'tableHeader' },
    //                     { text: 'Quantity', style: 'tableHeader' },
    //                     { text: 'Unit Price', style: 'tableHeader' },
    //                     { text: 'Total', style: 'tableHeader' },
    //                 ],
    //                 ...this.orderNoteData.products.map((prod) => [
    //                     prod.productName,
    //                     prod.quantity.toString(),
    //                     `${prod.unitPrice}$`,
    //                     `${(prod.quantity * prod.unitPrice).toFixed(2)}$`,
    //                 ]),
    //             ];
    //             const docDefinition: any = {
    //                 pageSize: pageSize,
    //                 content: [
    //                     { image: base64Image, width: 100, height: 50, alignment: 'center' },
    //                     { text: `Date: ${formattedDate}`, fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
    //                     { text: 'Order Note', style: 'header', alignment: 'center' },
    //                     { text: this.orderNoteData.orderDate },
    //                     { text: `Table: ${tableId}`, style: 'subheader', alignment: 'center' },
    //                     { text: 'Products:', fontSize: 14, bold: true, margin: [0, 10, 0, 8] },
    //                     {
    //                         style: 'tableExample',
    //                         table: {
    //                             headerRows: 1,
    //                             body: productsTableBody,
    //                             margin: [0, 0, 0, 8],
    //                         },
    //                         layout: 'lightHorizontalLines',
    //                     },
    //                     { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1 }] },
    //                     { text: `Employee name: ${this.orderNoteData.employeeName}`, margin: [0, 15, 0, 0] },
    //                     { text: `Order: ${this.orderNoteData.orderId}` },
    //                     { text: `Order status: ${this.orderNoteData.orderStatus}`, margin: [0, 0, 0, 8] },
    //                     { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 1 }] },
    //                     { text: `Total: ${this.orderNoteData.total.toFixed(2)}$`, style: 'header', margin: [0, 15, 30, 0], alignment: 'right' },
    //                 ],
    //                 styles: {
    //                     header: { fontSize: 20, bold: true },
    //                     subheader: { fontSize: 16, bold: true },
    //                     tableHeader: { bold: true, fontSize: 13, color: 'black' },
    //                     divider: { margin: [0, 10, 0, 10], alignment: 'center' },
    //                 },
    //                 defaultStyle: {
    //                     lineHeight: 1.5,
    //                 },
    //             };

    //             pdfMake.createPdf(docDefinition).download();
    //         },
    //         error: (e) => {
    //             console.log(e);
    //         },
    //     });
    // }
}
