import { Component, OnInit } from '@angular/core';
import { AdminService, Apiconfig } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-jobdetails',
  templateUrl: './jobdetails.component.html',
  styleUrls: ['./jobdetails.component.scss']
})
export class JobdetailsComponent implements OnInit {
  editid : string;
  jobDetails = [];
  transactionList = [];
  defaultCurrancy = [];
  spinner = 'none';
  constructor(private apiService: AdminService, private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.editid = this.ActivatedRoute.snapshot.paramMap.get('id');
    if(this.editid){
      this.showspinner();
      this.apiService.CommonApi('post', Apiconfig.jobEdit, { id: this.editid }).subscribe(result=>{
        if(result.status == 1){
          this.hidespinner();
          this.jobDetails.push(result.response);
          this.jobDetails.forEach(item => {
            this.ststusNameConvertion(item);
           });
        }else{
          this.hidespinner();
          return
        }
      });
      this.apiService.CommonApi('post', Apiconfig.jobTransactionList, {id: this.editid}).subscribe(transResult =>{
        if(transResult.status == 1){
          this.transactionList = transResult.response;
        }
      });
      this.apiService.CommonApi('get', Apiconfig.taskerdefaultcurrency, {}).subscribe(
        (result) => {
          if (result.status == 1) {
            this.defaultCurrancy.push(result.response);
          }
        })
    }
  }

  
  ststusNameConvertion(item){
    switch (item.status) {
      case 1:
        item.status = 'Assigned';
        break;
      case 2:
        item.status = 'Accepted';
        break;
      case 3:
        item.status = 'StartOff';
        break;
      case 4:
        item.status = 'Arrived';
        break;
      case 5:
        item.status = 'Start Job';
        break;
      case 6:
        item.status = 'Payment Pending';
        break;
      case 7:
        item.status = 'Payment Completed';
        break;
      case 8:
        item.status = 'Cancelled';
        break;
      case 9:
        item.status = 'Disputed';
        break;
      case 0:
        item.status = 'Deleted';
        break;
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
