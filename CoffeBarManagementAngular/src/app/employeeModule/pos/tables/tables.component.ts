import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { GetTables } from '../../../shared/models/getTables';
import { PosService } from '../pos.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent implements OnInit {

  constructor(public sharedService: SharedService, private posService: PosService, private router: Router ){}
  

  allTables : GetTables [] = [];

  ngOnInit(): void {
    this.getAllTables();
  }

  changeTableStatus(tableID: number, tableStatus: boolean){
    const model: GetTables = {
      tableID: tableID,
      capacity: 0,
      tableStatus: tableStatus
    }
    if(confirm("Do you rly want to change that status?")){
      this.posService.changeTableStatus(model).subscribe({
        next: (response:any) => {
          this.sharedService.showNotificationAndReload(true,'Success :D', response.value.message,true);
        },
        error: e => {
          this.sharedService.showNotification(false,'Error :(', e.error.value.message);
        }
      })
    }
  }


  getAllTables(){
    this.sharedService.getAllTables().subscribe({
      next:(response: any) => {
        this.allTables = response;
      },
      error: e => {
        console.log(e);
      }
    })
  }  

  createOrder(tableId: number){
    const navigationExtras : NavigationExtras = {
      state: {
        tableId
      },
    };
    //console.log('Navigating with state:', navigationExtras.state);
    this.router.navigate(['/employees','pos'], navigationExtras);
  }
}
