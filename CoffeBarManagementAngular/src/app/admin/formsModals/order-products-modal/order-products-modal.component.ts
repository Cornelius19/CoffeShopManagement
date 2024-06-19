import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MenuService } from '../../../menu/menu.service';
import { SharedService } from '../../../shared/shared.service';
import { AdminService } from '../../admin-service.service';
import { OrderProduct } from '../../../shared/models/orderProduct';

@Component({
  selector: 'app-order-products-modal',
  templateUrl: './order-products-modal.component.html',
  styleUrl: './order-products-modal.component.css'
})
export class OrderProductsModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
) {}

  products:OrderProduct[] = [];
  
  ngOnInit(): void {
    
  }





}
