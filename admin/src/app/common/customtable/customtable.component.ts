import { Component, Input, OnInit, EventEmitter, Output, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AdminService, Apiconfig } from "src/app/_services";
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
	selector: 'app-customtable',
	templateUrl: './customtable.component.html',
	styleUrls: ['./customtable.component.scss']
})
export class CustomtableComponent implements OnInit {
	@ViewChild('form') form: NgForm;
	@Input() settings: any;
	@Input() source: any;
	@Input() card_details: any[];
	@Input() editurl: string;
	@Input() viewurl: string;
	@Input() addurl: string;
	@Input() manageurl: string;
	@Input() managemobileurl: string;
	@Input() addbtn_name: string = 'pages.add-new';
	@Input() deleteurl: string;
	@Input() verifyurl: string;
	@Input() tablecommon: any;
	@Input() showSearch = true;
	@Input() showBulkActions = true;
	@Input() showItemsPerPage = true;
	@Input() EarningFilter = false;
	@Input() AddNewItem = true;
	@Input() ExportItem = false;
	@Input() SendMail = false;
	@Input() SendNotifications = false;
	@Input() PaymentFilter = false;
	@Input() AllJobsFilter = false;
	@Input() count: number = 0;
	@Input() itemsPerPage: number = 10;
	@Input() itemOptionsPerPage = [5, 10, 50, 100];
	@Output() onDeleteChange: EventEmitter<any> = new EventEmitter();
	@Output() onPageChange: EventEmitter<any> = new EventEmitter();
	@Output() onSearchChange: EventEmitter<any> = new EventEmitter();
	@Output() onitemsPerPageChange: EventEmitter<any> = new EventEmitter();
	@Output() onexportemit: EventEmitter<any> = new EventEmitter();
	@Output() onheaderCardChange: EventEmitter<any> = new EventEmitter();
	@Output() onRestore: EventEmitter<any> = new EventEmitter();
	@Output() onForcedelete: EventEmitter<any> = new EventEmitter();
	@Output() onMailSend: EventEmitter<any> = new EventEmitter();
	@Output() onSendNotification: EventEmitter<any> = new EventEmitter();
	@Output() onsearchfilter: EventEmitter<any> = new EventEmitter();
	@Output() onAlljobsFilter: EventEmitter<any> = new EventEmitter();
	@Output() onPayoutFilter: EventEmitter<any> = new EventEmitter();
	@Output() ontaskerChange: EventEmitter<any> = new EventEmitter();
	@Output() ontaskerPayout: EventEmitter<any> = new EventEmitter();


	itemAction = { label: 'Bulk Action', value: '' } as any;
	itemOptionsActions = [{ label: 'Bulk Action', value: '' }, { label: 'Delete Selected', value: 'delete' }] as any;
	seletedRow = [];
	actionconfirm: string;
	manageDataDelete: any;
	modalRef: BsModalRef;
	modal_title: string = 'modal.confirm-message';
	taskerlist: any;
	billingcycle: any;
	firstcycledata: any;
	billcycledate: any;

	date = new Date();
	latest_date = new DatePipe('en-US').transform(this.date, 'yyyy-MM-dd');
	ngOnChanges() {
		// console.log(this.editurl);
		// console.log(this.viewurl);    
	}
	constructor(
		private route: Router,
		private Apiservice: AdminService,
		private elementRef: ElementRef,
		private modalService: BsModalService,
		private notifications: NotificationsService) {
	}

	ngOnInit() {//fa fa-bars
		this.Apiservice.CommonApi('post', Apiconfig.Earningtaskerlist, {}).subscribe(
			(result) => {
				if (result.status == 1) {
					this.taskerlist = result.response;
				}
			}, (error) => {
				console.log(error);
			})

		this.Apiservice.CommonApi('get', Apiconfig.Payoutbillingcycle, {}).subscribe(
			(result) => {
				if (result.status == 1) {
					this.billingcycle = result.response;
				}
			}, (error) => {
				console.log(error);
			})
		this.Apiservice.CommonApi('get', Apiconfig.Payoutfirstbillingcycle, {}).subscribe(
			(result) => {
				if (result.status == 1) {
					this.firstcycledata = result.response;
					if (this.firstcycledata.billingcycyle) {
						var myString = this.firstcycledata.billingcycyle;
						var myArray = myString.split('-');
						this.billcycledate = new DatePipe('en-US').transform(myArray[1], 'yyyy/MM/dd');
					} else {
						this.billcycledate = "";
					}


				}
			}, (error) => {
				console.log(error);
			})
	}

	onCustomAction(event) {
		if (event && event.action == "editaction") {
			// this.onEditChange.emit(event.data);
			this.route.navigate([this.editurl, event.data._id]);
		} else if (event && event.action == "deleteaction") {
			// this.onDeleteChange.emit(event.data);
			this.actionconfirm = 'delete';
			this.modal_title = 'modal.confirm-message';
			this.seletedRow = [event.data];
			this.elementRef.nativeElement.querySelector('.delete-btn').click();
		} else if (event && event.action == "viewaction") {
			// this.onViewChange.emit(event.data);
			this.route.navigate([this.viewurl, event.data._id]);
		} else if (event && event.action == "pageaction") {
			this.onPageChange.emit(event.data);
		} else if (event && event.action == "managemobileaction") {
			// this.onViewChange.emit(event.data);
			this.route.navigate([this.managemobileurl, event.data.code]);
		} else if (event && event.action == "manageaction") {
			// this.onViewChange.emit(event.data);      
			this.route.navigate([this.manageurl, event.data.code]);
		} else if (event && event.action == "managedeleteaction") {
			// this.onViewChange.emit(event.data)
			this.manageDataDelete = event.data;
			this.actionconfirm = 'delete';
			this.elementRef.nativeElement.querySelector('.delete-btn').click();
		} else if (event && event.action == "forcedeleteaction") {
			// this.onDeleteChange.emit(event.data);
			this.modal_title = 'modal.delete-message';
			this.actionconfirm = 'forcedelete';
			this.elementRef.nativeElement.querySelector('.delete-btn').click();
			this.seletedRow = [event.data];
		} else if (event && event.action == "restoreaction") {
			// this.onDeleteChange.emit(event.data);
			this.actionconfirm = 'restore';
			this.modal_title = 'modal.restore-message';
			this.elementRef.nativeElement.querySelector('.delete-btn').click();
			this.seletedRow = [event.data];
		} else if (event && event.action == "verifyaction") {
			// this.onDeleteChange.emit(event.data);
			this.seletedRow = [event.data];

		} else if (event && event.action == "taskeraction") {
			this.ontaskerChange.emit(event.data);
			this.seletedRow = [event.data];

		} else if (event && event.action == "taskerpayoutaction") {

			this.actionconfirm = 'taskerpayout';
			this.seletedRow = [event.data];
			this.ontaskerPayout.emit(event.data);

		}
	}

	onexportitem(event) {
		this.onexportemit.emit(event);
	}

	onSendMail(event) {
		this.onMailSend.emit(this.seletedRow);
	}
	SendNotification(event) {
		this.onSendNotification.emit(this.seletedRow);
	}
	onUserRowSelect(event) {
		this.seletedRow = event.selected;
	}
	onAddNewItem() {
		if (this.addbtn_name == 'paymentPrice.add-new') {
			if (this.source && this.source.data && this.source.data.length < 3) {
				this.route.navigate([this.addurl])
			} else {
				this.notifications.create('Error', "Payment Price can't be exceed than 3 count", NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			}
		} else if (this.addbtn_name == 'postheader.add-new') {
			if (this.source && this.source.data && this.source.data.length < 3) {
				this.route.navigate([this.addurl])
			} else {
				this.notifications.create('Error', "Post Headers can't exceed than three", NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			}
		}
		else {
			this.route.navigate([this.addurl]);
		}
	}
	onSearchKeyUp(event) {
		this.onSearchChange.emit(event);
	}

	onChangeOrderBy(item) {
		this.itemAction = item;
		if (item && item.value == "delete") {
			if(this.seletedRow.length > 0){
				this.elementRef.nativeElement.querySelector('.delete-btn').click();
			}else{
				this.itemAction = { label: 'Bulk Action', value: '' };
				this.notifications.create('Error', "Please atleat select one row.", NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			}
		}
	}

	onChangeItemsPerPage(item) {
		if (item) {
			this.itemsPerPage = item;
			this.onitemsPerPageChange.emit(item);
		}
	}
	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, { class: 'modal-md' });
	}
	confirm(): void {
		this.modalRef.hide();
		if (this.actionconfirm == 'delete') {
			this.deletefunction(this.seletedRow);
		} else if (this.actionconfirm == 'restore') {
			this.onRestore.emit(this.seletedRow);
		} else if (this.actionconfirm == 'forcedelete') {
			this.onForcedelete.emit(this.seletedRow);
		} else {
			this.deletefunction(this.seletedRow);
		}

	}

	deletefunction(data: any[]) {
		console.log('delete');
		let deletedata = [];
		if (data && data.length > 0 && typeof data[0]._id != 'undefined' && this.deleteurl != 'Apiconfig.taskersdelete') {
			deletedata = data.map(x => x._id);
			this.Apiservice.CommonApi('post', this.deleteurl, { ids: deletedata }).subscribe(
				(result) => {
					if (result.status == 1) {
						this.seletedRow = [];
						this.itemAction = { label: 'Bulk Action', value: '' };
						this.onDeleteChange.emit('Successfully deleted!.');
					}
				}, (error) => {
					this.itemAction = { label: 'Bulk Action', value: '' };
					console.log(error);
				})
		} else if (data.length == 0) {
			this.itemAction = { label: 'Bulk Action', value: '' };
			this.onDeleteChange.emit(this.manageDataDelete);
		}
	}
	verifyfunction(data: any[]) {
		let verifydata = [];
		if (data && typeof data[0]._id != 'undefined') {
			verifydata = data.map(x => x._id);
			this.Apiservice.CommonApi('post', this.verifyurl, { ids: verifydata }).subscribe(
				(result) => {
					if (result.status == 1) {
						this.onDeleteChange.emit('Successfully verified!');
					}
				}, (error) => {
					console.log(error);
				})
		} else if (typeof data == 'undefined') {
			this.onDeleteChange.emit(this.manageDataDelete);
		}
	}
	headercardfun(event) {
		this.onheaderCardChange.emit(event);
	}
	Pagechange(event) {
		if (event && typeof event.page != 'undefined') {
			this.onPageChange.emit(event.page);
		}
	}
	PerPagechange(event) {
		if (event && event.pagingConf && event.pagingConf.perPage) {
			this.onitemsPerPageChange.emit(event.pagingConf.perPage);
		}
	}

	earningsearch() {
		this.onsearchfilter.emit(this.form.value);
	}
	earningclear() {
		this.onsearchfilter.emit('');
	}

	alljobsearch() {
		this.onAlljobsFilter.emit(this.form.value);
	}

	alljobclear() {
		this.onAlljobsFilter.emit('');
	}

	billingcycyledata(event) {
		this.onPayoutFilter.emit(event);
	}
}