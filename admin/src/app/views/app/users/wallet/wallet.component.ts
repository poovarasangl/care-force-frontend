import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService } from "../../../../_services";
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  settings: any;
  count : number = 0;
  source: LocalDataSource = new LocalDataSource();
	spinner = 'none';
  constructor(
    private Apiservice: AdminService,
    private ActivatedRoute: ActivatedRoute
    ) {

    this.settings = {
			selectMode: 'multi',
			hideSubHeader: true,
			columns: {
				title: {
					title: 'Title',
					filter: true
				},
				trans_amount: {
					title: 'Transaction Amount',
					filter: true
				},
				avail_amount: {
					title: 'Balance Amount',
					filter: true
				},
				type: {
					title: 'Transaction Type',
					filter: true
				},
				trans_date: {
					title: 'Transaction Date',
					filter: true,
					valuePrepareFunction: date => {
						if (date) {
							return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh-mm a');
						} else {
							return null;
						}
					}
				}
			},
			pager: {
				display: true,
				perPage: 10
			},
			actions: {
				add: false,
				edit: false,
				delete: false,
				columnTitle: 'Actions',
				class: 'action-column',
				position: 'right'
			},
		}
   }

  ngOnInit(): void {
	  this.showspinner();
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.Apiservice.CommonApi('post', Apiconfig.getUserwalletdata, {'id':id, 'skip': 0, 'limit': 25 }).subscribe((results: any) => {
      
      if (results.status === 1) {
		  this.hidespinner();
        if(results.response != ''){
			this.hidespinner();
          this.source.load(results.response[0].transactions);
        }else{
			this.hidespinner();
          this.source.load(results.response);
		}
			} else {
		  this.hidespinner();
				return;
			}
		});
  }

  onDeleteChange(event) {
		console.log(event);
	}
	onPageChange(event) {
		console.log(event);
	}
	onSearchChange(event) {
		console.log(event);
	}
	onAddnewChange(event) {
		console.log(event);
	}
	onBulkactionChange(event) {
		console.log(event);
	}
	onitemsPerPageChange(event) {
		console.log(event);
	}
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}

}
