import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService } from "../../../../_services";
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
	selector: 'app-payoutedit',
	templateUrl: './payoutedit.component.html',
	styleUrls: ['./payoutedit.component.scss']
})
export class PayouteditComponent implements OnInit {
	settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit: number = 10;
	count: number = 0;
	modalRef: BsModalRef;
	source: LocalDataSource = new LocalDataSource();
	taskerpayout: string = Apiconfig.Payouttaskerpauot;
	tasker_name: String;
	billingCycle: any;
	stripe_id: string;
	total_amount: number;
	appointment: any;
	admin_commission: number;
	coupon: number;
	extra_amount: number;
	grandtotal: number;
	paid_count: number;
	servicetax: number;
	tasker_earning: number;
	net_total: number;
	notpaid_admin_commission: number;
	notpaid_extra_amount: number;
	notpaid_tasker_earning: number;
	tasker_settled_amt: number;
	amtWithTasker: number;
	amtWithAdmin: number;
	defaultcurrencysymbol: any;
	tobepay: number;
	amounttosettle = {};
	total: any;
	cash: any;
	gateway: any;
	by: string;
	to: string;
	modal_title: any;
	bookingid: any;
	diffcount: any;
	actionclick: any;
	spinner = 'none';

	constructor(
		private Apiservice: AdminService,
		private cd: ChangeDetectorRef,
		private router: Router,
		private ActivatedRoute: ActivatedRoute,
		private notifications: NotificationsService,
		private modalService: BsModalService,
		private elementRef: ElementRef,
	) {
		this.settings = {
			selectMode: 'multi',
			hideSubHeader: true,
			columns: {
				booking_id: {
					title: 'Appointment',
					filter: true
				},
				booking_date: {
					title: 'Date',
					filter: true
				},
				task_cost: {
					title: 'Service Total',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				servicetax: {
					title: 'Service Tax',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				extra_amount: {
					title: 'Material Amount',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				coupon: {
					title: 'Coupon',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}

				},
				total: {
					title: 'Total',
					filter: true,
					valuePrepareFunction: (value) => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				admin_commission: {
					title: 'Admin Commission',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				tasker_earning: {
					title: 'Tasker Earnings',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				grand_total: {
					title: 'Grand Total',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				payee_status: {
					title: 'Paid',
					filter: true,
					valuePrepareFunction: value => {
							if(value == 1){
								this.actionclick = 'Paid';
								return 'Yes';
							}else{
								this.actionclick = 'Pay';
								return 'No';
							}
						//return value == 1 ? 'Yes' : 'No'
					}
				}

			},
			pager: {
				display: true,
				perPage: 10
			},
			actions: {
				add: true,
				edit: false,
				delete: false,
				columnTitle: 'Actions',
				class: 'action-column',
				position: 'right',
				custom: [
					{
						name: 'taskerpayoutaction',
						value: 'Paid',
						click:  1, 
						title: '<div class="action-btn badge badge-pill badge-info mb-1"><i class="glyph-icon simple-icon-wallet"></i></div>',
						type: 'html',
					}
				],
			},
		}
	}
	
	ngOnInit() {
		this.showspinner();
		const id = this.ActivatedRoute.snapshot.paramMap.get('id');
		const cycle = this.ActivatedRoute.snapshot.paramMap.get('id2');
		this.Apiservice.CommonApi('get', Apiconfig.taskerdefaultcurrency, {}).subscribe(
			(results) => {
				this.hidespinner();
				if (results.status == 1) {
					this.defaultcurrencysymbol = results.response.symbol;
				}
			})

		this.source = new LocalDataSource();
		let data = {
			'tasker': id,
			'skip': this.skip,
			'limit': this.limit
		}
		if (cycle) {
			data['cycle'] = cycle;
			this.billingCycle = cycle;
		}

		this.Apiservice.CommonApi('post', Apiconfig.payouttakerearninglist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
				this.gateway = results.paid_service.gateway;
				this.total = results.paid_service.total;
				this.cash = results.paid_service.cash;
				this.tasker_name = results.paid_service.tasker.username || '';
				this.stripe_id = results.paid_service.tasker.stripe || '';
				this.appointment = results.paid_service.count || 0;
				this.admin_commission = (results.paid_service.total.admin_commission).toFixed(2) || 0;
				this.coupon = (results.paid_service.total.coupon).toFixed(2) || 0;
				this.extra_amount = (results.paid_service.total.extra_amount).toFixed(2) || 0;
				this.grandtotal = (results.paid_service.total.grandtotal).toFixed(2) || 0;
				this.paid_count = results.paid_service.total.paid_count || 0;
				this.servicetax = (results.paid_service.total.servicetax).toFixed(2) || 0;
				this.tasker_earning = (results.paid_service.total.tasker_earning).toFixed(2) || 0;
				this.total_amount = (results.paid_service.total.total).toFixed(2) || 0;
				this.net_total = (results.paid_service.total.total - results.paid_service.total.coupon + results.paid_service.total.servicetax).toFixed(2) || 0;
				this.notpaid_admin_commission = (results.paid_service.notpaid_admin_commission).toFixed(2);
				this.notpaid_tasker_earning = (results.paid_service.notpaid_tasker_earning).toFixed(2);
				this.notpaid_extra_amount = (results.paid_service.notpaid_extra_amount).toFixed(2);
				this.tobepay = (results.paid_service.notpaid_tasker_earning).toFixed(2);
				this.tasker_settled_amt = ((results.paid_service.total.tasker_earning + results.paid_service.total.extra_amount) - results.paid_service.notpaid_tasker_earning + results.paid_service.notpaid_extra_amount).toFixed(2) || 0;
				this.amtWithTasker = results.paid_service.cash.admin_commission + results.paid_service.cash.servicetax;
				this.amtWithAdmin = (results.paid_service.gateway.tasker_earning) + (results.paid_service.gateway.extra_amount);
				this.diffcount = this.appointment - this.paid_count;
				if (this.amtWithAdmin > this.amtWithTasker) {
					this.amounttosettle['by'] = "admin";
					this.by = 'admin';
					this.to = "tasker";
					this.amounttosettle['to'] = "tasker";
					this.amounttosettle['amount'] = (results.paid_service.gateway.tasker_earning) + (results.paid_service.gateway.extra_amount);
				}
				else {
					this.amounttosettle['by'] = "tasker";
					this.amounttosettle['to'] = "admin";
					this.by = 'tasker';
					this.to = "admin";
					this.amounttosettle['amount'] = this.amtWithTasker - this.amtWithAdmin;
				}
			} else {
				this.hidespinner();
				return;
			}
		});

	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, { class: 'modal-md' });
	}

	confirm() {
		this.modalRef.hide();
		const id = this.ActivatedRoute.snapshot.paramMap.get('id');
		const cycle = this.ActivatedRoute.snapshot.paramMap.get('id2');
		let data = {
			'billingcycle': cycle,
			'booking_id': this.bookingid
		}
		this.Apiservice.CommonApi('post', this.taskerpayout, data).subscribe((data: any) => {
			if (data.status === 1) {
				this.notifications.create('Success', 'Payment Successfully completed', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
				this.ngOnInit();
			} else {
				this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
			}
		});
	}

	ontaskerPayout(event) {
		this.elementRef.nativeElement.querySelector('.payout-btn').click();
		this.bookingid = event.booking_id;
	}

	onPageChange(event) {
		this.showspinner();
		const id = this.ActivatedRoute.snapshot.paramMap.get('id');
		const cycle = this.ActivatedRoute.snapshot.paramMap.get('id2');
		this.source = new LocalDataSource();
		let data = {
			'tasker': id,
			'skip': this.limit * (event - 1),
			'limit': this.limit * event
		}
		if (cycle) {
			data['cycle'] = cycle;
		}
		this.Apiservice.CommonApi('post', Apiconfig.payouttakerearninglist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
				this.count = results.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	onSearchChange(event) {
		this.showspinner();
		const id = this.ActivatedRoute.snapshot.paramMap.get('id');
		const cycle = this.ActivatedRoute.snapshot.paramMap.get('id2');
		this.source = new LocalDataSource();
		let data = {
			'tasker': id,
			'skip': this.skip,
			'limit': this.limit,
			'search': event,
		}
		if (cycle) {
			data['cycle'] = cycle;
		}
		this.Apiservice.CommonApi('post', Apiconfig.payouttakerearninglist, data).subscribe((results: any) => {

			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	onAddnewChange(event) {
		console.log(event);
	}

	onBulkactionChange(event) {
		console.log(event);
	}

	onitemsPerPageChange(event) {
		this.showspinner();
		this.limit = event;
		this.skip = 0;
		this.default_limit = event;
		const id = this.ActivatedRoute.snapshot.paramMap.get('id');
		const cycle = this.ActivatedRoute.snapshot.paramMap.get('id2');
		this.source = new LocalDataSource();
		let data = {
			'tasker': id,
			'skip': this.skip,
			'limit': event
			
		}
		if (cycle) {
			data['cycle'] = cycle;
		}

		this.Apiservice.CommonApi('post', Apiconfig.payouttakerearninglist, data).subscribe((results: any) => {

			if (results.status === 1) {
				this.hidespinner();

				this.source.load(results.response);
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	updatepay(){
		this.elementRef.nativeElement.querySelector('.updatepay-btn').click();
	}
        
	paytasker() {
		this.showspinner();
		this.modalRef.hide();
		const id = this.ActivatedRoute.snapshot.paramMap.get('id');
		var data = {};
		data['tasker'] = id;
		data['billing_cycle'] = this.billingCycle;
		data['invoice'] = {
			'cash': this.cash,
			'gateway': this.gateway,
			'total': this.total,
			'task_count': this.appointment,
			'payment': this.amounttosettle
		};

		this.Apiservice.CommonApi('post', Apiconfig.Payoutupdatepayee, data).subscribe((data: any) => {

			if (data.status === 1) {
				this.hidespinner();
				this.notifications.create('Success', 'Payment Successfully Updated', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
				this.ngOnInit();
			} else {
				this.hidespinner();
				this.notifications.create('Error', 'Unable to save your data', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
			}
		});

	}
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}
}
