import { Component, OnInit, ViewChild, TemplateRef, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AdminService, Apiconfig } from "src/app/_services";
import { TabDirective } from 'ngx-bootstrap/tabs';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import * as moment from "moment";
@Component({
	selector: 'app-taskersedit',
	templateUrl: './taskersedit.component.html',
	styleUrls: ['./taskersedit.component.sass']
})
export class TaskerseditComponent implements OnInit {

	isCollapsed = false;
	@ViewChild('Expertsedittab', { static: false }) Expertsedittab: TabsetComponent;

	@ViewChild('form') form: NgForm;
	@ViewChild('aboutform') aboutform: NgForm;
	@ViewChild('qusform') qusform: NgForm;
	@ViewChild('catform') catform: NgForm;
	@ViewChild('addressform') addressform: NgForm;
	@ViewChild('catnoneditform') catnoneditform: NgForm;
	@ViewChild('templatedocaddform') templatedocaddform: NgForm;
	@ViewChild('bankform') bankform: NgForm;
	@ViewChild('allWeek') weekElementRef: ElementRef;
	@ViewChild('search') searchElementRef: ElementRef;

	private geoCoder;

	buttonDisabled = false;
	buttonState = '';
	submitted: boolean = false;
	imageUrl: string = environment.apiUrl;
	countrycode = '';
	taskersavedata = new FormData();
	modalRef: BsModalRef;
	wholeday: any;
	editid: any;
	experteditdata: any;
	experteditpagetwodata: any;
	public question: string;
	public name: string;
	bsValue: any;
	latitude: number;
	longitude: number;
	zoom: number;
	address: string;
	imagepreview = {
		image: '' as string | ArrayBuffer,
		front: '' as string | ArrayBuffer,
		back: '' as string | ArrayBuffer
	}
	taskercategory: any;
	taskerupdatedata:any={}
	catfilter: any;
	documentlist: any;
	subcat: any;
	experience: any;
	skip: number = 0;
	limit: number = 10;
	activeexplist: any;
	catrate: any;
	ratetype: any;
	commission: any;
	defaultcurrencysymbol: any;
	showerror: boolean = false;
	title: string;
	skillsarr: any;
	categoryEdititems: any;
	showediterror: boolean;
	houlryrate: any;
	imageurl = environment.apiUrl;
	bankingifo: any;
	birthdate: any;
	agm_address = {
		line1: '',
		line2: '',
		city: '',
		state: '',
		country: '',
		zipcode: '',
		formatted_address: ''
	}
	dayslist = [
		{
			Day: 'Sunday', selected: false, wholeday: 0,
			timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
			{ time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
			{ time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
			{ time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
			{ time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
			{ time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
			{ time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
			{ time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
			]
		},
		{
			Day: 'Monday', selected: false, wholeday: 0,
			timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
			{ time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
			{ time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
			{ time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
			{ time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
			{ time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
			{ time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
			{ time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
			]
		},
		{
			Day: 'Tuesday', selected: false, wholeday: 0,
			timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
			{ time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
			{ time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
			{ time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
			{ time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
			{ time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
			{ time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
			{ time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
			]
		},
		{
			Day: 'Wednesday', selected: false, wholeday: 0,
			timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
			{ time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
			{ time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
			{ time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
			{ time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
			{ time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
			{ time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
			{ time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
			]
		},
		{
			Day: 'Thursday', selected: false, wholeday: 0,
			timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
			{ time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
			{ time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
			{ time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
			{ time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
			{ time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
			{ time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
			{ time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
			]
		},
		{
			Day: 'Friday', selected: false, wholeday: 0,
			timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
			{ time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
			{ time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
			{ time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
			{ time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
			{ time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
			{ time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
			{ time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
			]
		},
		{
			Day: 'Saturday', selected: false, wholeday: 0,
			timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
			{ time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
			{ time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
			{ time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
			{ time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
			{ time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
			{ time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
			{ time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
			]
		}];
	tabheads: any;
	deleteid: any;
	deletecat = { childid: '', id: '' };
	verfiyitems = {
		id: '',
		childid: '',
		status: ''
	}
	cateditsavedatas = {
		id: '',
		categoryid: '',
		childid: '',
		status: '',
		experience: '',
		hour_rate: ''
	}
	value: boolean = false;
	cateditdatas = {
		categoryid: '',
		childid: '',
		status: '',
	}
	bankinfosave = {
		id: '',
		banking: {
			acc_holder_name: '',
			acc_number: '',
			bank_name: '',
			routing_number: '',
			ssn_number: ''
		}
	}
	
	ediDocument: any;
	address_err: string;
	updatableplace: google.maps.places.PlaceResult;
	generalsettingsdata: any;
	showdocoption: boolean;
	docsave: boolean;
	docaddsave: boolean;
	addDocument: any;
	diffInDays: number;
	agelimitbar: boolean;

	constructor(private modalService: BsModalService,
		private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone,
		private router: Router,
		private route: ActivatedRoute,
		private AdminService: AdminService,
		private notifications: NotificationsService,
	) { }

	ngOnInit(): void {
	this.taskerupdatedata = {
		
			country_code: '',
			availability_address: '',
			avatarBase64: '' as string | ArrayBuffer,
			birthdate: {},
			email: '',
			firstname: '',
			gender: '',
			language: '',
			lastname: '',
			location: {
				lat: '',
				lng: ''
			},
			phone: {
				code: '',
				number: ''
			},
			doc: [{}],
			taskerskills: [{}],
			profile_details: [{}],
			role: '',
			status: '',
			username: '',
			working_days: [{}],
			id: '',
		} as any;
		this.taskerupdatedata.address={} as any
		
	this.taskerupdatedata.address.line1= ''
	this.taskerupdatedata.address.line2= ''
	this.taskerupdatedata.address.city= ''
	this.taskerupdatedata.address.state= ''
	this.taskerupdatedata.address.country= ''
	this.taskerupdatedata.address.zipcode= ''
	this.taskerupdatedata.address.formatted_address= ''

				
		
		this.taskersavedata = new FormData();
		this.editid = this.route.snapshot.paramMap.get('id');
		if (this.editid) {
			this.title = "Edit";
			this.AdminService.CommonApi('post', Apiconfig.taskeredit, { id: this.editid }).subscribe(
				(results) => {

					if (results.status == 1) {
						this.experteditdata = results.response;
						this.form.form.controls['firstname'].setValue(this.experteditdata.firstname);
						this.form.form.controls['lastname'].setValue(this.experteditdata.lastname);
						this.form.form.controls['gender'].setValue(this.experteditdata.gender);
						this.form.form.controls['email'].setValue(this.experteditdata.email);
						this.form.form.controls['phone'].setValue(this.experteditdata.phone.number);
						this.form.form.controls['status'].setValue(this.experteditdata.status + '');
						let date = this.experteditdata.birthdate.date + '/' + this.experteditdata.birthdate.month + '/' + this.experteditdata.birthdate.year
						let [day, month, year] = date.split('/')
						const dateObj = new Date(+year, +month - 1, +day)


						this.form.form.controls['basicDate'].setValue(dateObj);


						if (this.experteditdata && this.experteditdata.banking) {
							this.bankingifo = this.experteditdata.banking;
							this.bankform.form.controls['acc_holder_name'].setValue(this.bankingifo.acc_holder_name);
							this.bankform.form.controls['acc_number'].setValue(this.bankingifo.acc_number);
							this.bankform.form.controls['bank_name'].setValue(this.bankingifo.bank_name);
							this.bankform.form.controls['routing_number'].setValue(this.bankingifo.routing_number);
						}
						this.taskerquslist();
						console.log(this.experteditdata.birthdate)
						setTimeout(() => {
							this.address = this.experteditdata.availability_address;
							this.addressform.form.controls['address'].setValue(this.address);
							this.agm_address = this.experteditdata.address;


						}, 500);

						if (this.experteditdata.availability_address && this.experteditdata.working_days.length > 0) {
							this.experteditdata.working_days.forEach(item => {
								this.seletedtimeslot(item);
							})
						}
					} else {
						this.countrycode = "+91";
					}
				})
			this.taskercategorylist();
			this.taskerdocumentlist();
			this.taskerexplist();
			this.defaultcurrency();
		}
	}
	ngAfterViewInit() {
		this.loadmap();
		this.tabheads = this.Expertsedittab.tabs.filter(x => x.heading && x.active);
	}
	onSelect(data: TabDirective): void {
		if (data.heading == 'Category') {
			this.value = true;
		} else if (data.heading == 'TaskerDocuments') {
			this.value = true;
		} else if (data.heading == 'AccountInformation') {
			this.value = true;
		} else {
			this.value = false;
		}
	}
	mapClicked($event: MouseEvent) {

	}
	// Oninit api calls
	//  _______________________________

	taskerquslist() {
		this.AdminService.CommonApi('post', Apiconfig.taskersquslist, {}).subscribe(
			(results) => {
				if (results.status == 1) {
					this.experteditpagetwodata = results.response;
					let val = this.experteditpagetwodata.map((x) => {
						var resul = this.experteditdata.profile_details.filter(y => y.question == x._id);
						var returnval = {} as any;
						if (resul.length > 0) {
							returnval = x;
							returnval.answer = resul[0].answer;
						} else {
							returnval = x;
						}
						return returnval;
					})
					this.experteditpagetwodata = val;
				}
			})
	}
	taskercategorylist() {
		this.AdminService.CommonApi('get', Apiconfig.taskercatlist, {}).subscribe(
			(results) => {
				if (results.status == 1) {
					console.log(results.response,'results.response')
					this.taskercategory = results.response;
					let value = this.experteditdata.taskerskills.map((x) => {
						var resultcat = this.taskercategory.filter((y:any) => y._id == x.childid);
						var returnvalue = {} as any;
						if (resultcat.length > 0) {
							returnvalue.name =resultcat[0].name
							returnvalue.ratetype =resultcat[0].ratetype
							returnvalue.childid =resultcat[0]._id
							returnvalue.hour_rate=resultcat[0].commision
							// if (x.childid && resultcat[0].subcategories.length > 0) {
							// 	returnvalue.subcategorie_name = resultcat[0].subcategories[0].filter(z => z._id.toString() == x.childid.toString()).length > 0 ? resultcat[0].subcategories[0].filter(z => z._id.toString() == x.childid.toString())[0].name : ''
							// 	returnvalue.ratetype = resultcat[0].subcategories[0].filter(z => z._id.toString() == x.childid.toString()).length > 0 ? resultcat[0].subcategories[0].filter(z => z._id.toString
							
						} else {
							returnvalue = x;
						}
						return returnvalue;
					})

					this.experteditdata.taskerskills = value;
					this.skillsarr = this.experteditdata.taskerskills;
				}
			})
	}
	taskerdocumentlist() {
		this.AdminService.CommonApi('post', Apiconfig.taskerdocumentslist, {}).subscribe(
			(results) => {
				if (results.status == 1) {
					this.documentlist = results.response;
				}
			})
	}
	taskerexplist() {
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.AdminService.CommonApi('post', Apiconfig.experiencelist, data).subscribe(
			(results) => {
				if (results.status === 1) {
					this.experience = results.response;
					this.activeexplist = results.response.filter(x => x.status == 1);
				}
			})
	}
	defaultcurrency() {
		this.AdminService.CommonApi('get', Apiconfig.taskerdefaultcurrency, {}).subscribe(
			(results) => {
				if (results.status == 1) {
					this.defaultcurrencysymbol = results.response;

				}
			})
	}

	getFiles(event, key) {
		const imgbytes = event.target.files[0].size;
		const imgtype = event.target.files[0].type;
		this.taskersavedata.delete(key);
		if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
			if (Math.round(parseInt(imgbytes) / 1024) > 1024) {

			} else {
				this.preview(event.target.files[0], key);
				this.taskersavedata.append(key, event.target.files[0], event.target.files[0]['name']);
			}
		} else {

		}
	}

	DateCheck() {
		console.log(new Date);
		console.log(this.form.form.value.basicDate);
		var entereddate = this.form.form.value.basicDate
		this.diffInDays = (new Date()).valueOf() - (new Date(entereddate)).valueOf();
		let approxyear = this.diffInDays / 3.154e+10;
		if (approxyear < 18) {
			this.agelimitbar = true;
		} else {
			this.agelimitbar = false;
		}
		return this.agelimitbar;
	}
	preview(files, key) {
		// Show preview
		var mimeType = files.type;
		if (mimeType.match(/image\/*/) == null) {
			return;
		}

		var reader = new FileReader();
		reader.readAsDataURL(files);
		reader.onload = (_event) => {
			this.imagepreview[key] = reader.result;
		}
	}
	oncountryChange(event) {
		this.countrycode = '+' + event.dialCode;
	}
	getNumber(event) {
	}

	telInputObject(event) {
	}
	confirmsavecat(catform) {
		let catsavedata = catform.form.value;
		catsavedata.categoryid=catform.form.value.childid
		catsavedata.id = this.editid;
		catform.submitted = true;
		if (catform.form.status == 'VALID') {
			this.AdminService.CommonApi('post', Apiconfig.taskeraddcategory, catsavedata).subscribe(
				(results) => {
					if (results.status == 1) {
						this.modalRef.hide();
						this.notifications.create('Success', 'Category Added Successfully', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
						this.ngOnInit();
						(error) => {
							this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
							this.ngOnInit();
						}
					}
				})

		} else {
			this.notifications.create('Error', 'Please fill all fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		}
	}
	confirmcategorydelete() {
		this.deletecat.childid = this.deleteid;
		this.deletecat.id = this.editid;
		this.AdminService.CommonApi('post', Apiconfig.taskercategorydelete, this.deletecat).subscribe((results) => {
			if (results.status == 1) {
				this.modalRef.hide();
				this.notifications.create('Error', 'Category Deleted Successfully', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
				this.ngOnInit();
				this.deleteid = '';
			}
		})
	}
	changecatstatus(item) {
		this.verfiyitems.id = this.editid;
		this.verfiyitems.childid = item.childid;
		var statusvalue = item.status == 1 ? '2' : '1'
		this.verfiyitems.status = statusvalue;
		this.AdminService.CommonApi('post', Apiconfig.taskerapprovecat, this.verfiyitems).subscribe((results) => {
			if (results.status == 1) {
				this.notifications.create('Success', 'Category Status Updated Successfully', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
				this.ngOnInit();
			}
		})
	}
	confirmupdatecat(catnoneditform) {
		this.cateditsavedatas.categoryid = this.cateditdatas.categoryid;
		this.cateditsavedatas.status = this.cateditdatas.status;
		this.cateditsavedatas.childid = this.cateditdatas.childid;
		this.cateditsavedatas.experience = catnoneditform.form.value.experience;
		this.cateditsavedatas.id = this.editid;
		this.cateditsavedatas.hour_rate = catnoneditform.form.value.hour_rate;
		if (catnoneditform.form.status == 'VALID') {
			this.AdminService.CommonApi('post', Apiconfig.taskeraddcategory, this.cateditsavedatas).subscribe(
				(results) => {
					if (results.status == 1) {
						this.modalRef.hide();
						this.notifications.create('Success', 'Category Updated Successfully', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
						this.ngOnInit();
						(error) => {
							this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
						}
					}
				})
		} else {
			this.notifications.create('Error', 'Please fill all the fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		}
	}
	convertfile(event) {

	}
	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, { class: 'modal-md' });
		this.ratetype = '';
	}
	openModaledit(templateedit: TemplateRef<any>, item) {
		console.log(item,'---------------------')
		this.modalRef = this.modalService.show(templateedit, { class: 'modal-md' });
		this.categoryEdititems = item;
		this.houlryrate = this.categoryEdititems.hour_rate;
		this.cateditdatas.categoryid = item.childid;
		this.cateditdatas.childid = item.childid;
		this.cateditdatas.status = item.status;
	}
	openModalcatdelete(templatecatdelete, item) {
		this.modalRef = this.modalService.show(templatecatdelete, { class: 'modal-md' });
		this.deleteid = item.childid;
	}
	openModaldocedit(templatedocedit: TemplateRef<any>, item) {
		this.modalRef = this.modalService.show(templatedocedit, { class: 'modal-md' });
		this.imagepreview.front = '';
		this.imagepreview.back = '';
		this.ediDocument = item;
	}
	openModaladd(templatedocadd: TemplateRef<any>, item) {
		this.modalRef = this.modalService.show(templatedocadd, { class: 'modal-md' });
		this.imagepreview.front = '';
		this.imagepreview.back = '';
		this.addDocument = item;
	}

	deletedoc(templatedocdelete: TemplateRef<any>, item) {
		this.modalRef = this.modalService.show(templatedocdelete, { class: 'modal-md' });
		this.ediDocument = item;
	}

	confirm(templatedocedit): void {
		let data = {} as any;
		data.tasker = this.editid;
		data.doc_id = this.ediDocument._id;
		data.doc_name = this.ediDocument.name;
		data.doc_replace_name = this.ediDocument.replace_name;
		data.replace_name_back = this.ediDocument.replace_name_back;
		data.stripe = this.ediDocument.stripe;
		this.taskersavedata.append('info', JSON.stringify(data));
		if (templatedocedit.form.status === "VALID") {
			this.AdminService.CommonApi('post', Apiconfig.taskerupdatedocuments, this.taskersavedata).subscribe(
				(result) => {
					if (result.status == 1) {
						this.ediDocument = '';
						this.modalRef.hide();
						this.notifications.create('Success', 'Document Updated Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
						this.ngOnInit();
					} else {
						this.notifications.create('Error', result.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
					}
				}, (error) => {
					this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
				}
			)
		} else {
			this.docsave = true;
			this.notifications.create('Error', 'Select images to proceed', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
		}
	}
	confirmadd(templatedocaddform) {
		let data = {} as any;
		data.tasker = this.editid;
		data.doc_id = this.addDocument._id;
		data.doc_name = this.addDocument.name;
		data.doc_replace_name = this.addDocument.replace_name;
		data.replace_name_back = this.addDocument.replace_name_back;
		data.stripe = this.addDocument.stripe;
		// data.imagepreview = this.imagepreview;
		this.taskersavedata.append('info', JSON.stringify(data));
		if (templatedocaddform.form.status === "VALID") {
			this.AdminService.CommonApi('post', Apiconfig.taskeradddocuments, this.taskersavedata).subscribe(
				(result) => {
					if (result.status == 1) {
						this.addDocument = '';
						this.modalRef.hide();
						this.notifications.create('Success', 'Document Updated Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
						this.ngOnInit();

					} else {
						this.notifications.create('Error', result.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
					}
				}, (error) => {
					this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
				}
			)
		} else {
			this.docaddsave = true;
			this.notifications.create('Error', 'Select images to proceed', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
		}
	}
	delconfirm() {
		let data = {} as any;
		data.tasker = this.editid;
		data.doc_id = this.ediDocument._id;
		data.doc_name = this.ediDocument.name;
		this.AdminService.CommonApi('post', Apiconfig.taskerdeletedocuments, data).subscribe(
			(result) => {
				if (result.status == 1) {
					this.ediDocument = '';
					this.modalRef.hide();
					this.notifications.create('Success', 'Document Deleted Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
					this.ngOnInit();
				} else {
					this.notifications.create('Error', result.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
				}
			}, (error) => {
				this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			}
		);
	}

	Categorychange(event) {
		let index = this.taskercategory.findIndex(x => { return x._id.toString() === event.target.value.toString() });
		if (index !== -1) {
			// this.subcat = this.taskercategory[index]
			this.subcat = this.taskercategory[index]
			this.ratetype = this.subcat.ratetype;
			this.commission = this.subcat.commision;
	  
		} else {
			this.subcat = '';
		}
	}
	subcategorycommision(event) {
		let index = this.subcat.findIndex(x => { return x._id.toString() === event.target.value.toString() });
		if (index !== -1) {
			this.catrate = this.subcat[index];
			this.ratetype = this.catrate.ratetype;
			this.commission = this.catrate.commision;
		} else {
			this.catrate = '';
		}
	}

	minimumrate(event) {
		if (event.target.value < this.commission) {
			this.showerror = true;
		} else {
			this.showerror = false;
		}
	}
	minimumeditrate(event) {
		if (event.target.value < this.categoryEdititems.hour_rate) {
			this.showediterror = true;
		} else {
			this.showediterror = false;

		}
	}
	seletedtimeslot(selectedtime) {
		for (let i = 0; i < this.dayslist.length; i++) {
			if (selectedtime.day == this.dayslist[i].Day) {
				for (let j = 0; j < this.dayslist[i].timelist.length; j++) {
					if (selectedtime.wholeday == 1) {
						this.dayslist[i].wholeday = 1;
						this.dayslist[i].selected = true;
						this.dayslist[i].timelist[j].selected = true;
					} else if (selectedtime.wholeday == 0) {
						this.dayslist[i].selected = true;
						for (let k = 0; k < selectedtime.slots.length; k++) {
							if (j == selectedtime.slots[k]) {
								this.dayslist[i].timelist[j].selected = true;
							}
						}
					}
				}
			}
		}
	}
	wholeweek(event) {
		const checked = event.target.checked;
		this.wholeday = checked;
		this.dayslist.forEach(item => item.selected = checked);
		if (checked) {
			this.dayslist.forEach(item => item.wholeday = 1);
		} else {
			this.dayslist.forEach(item => item.wholeday = 0);
		}
		for (var i = 0; i < this.dayslist.length; i++) {
			for (var j = 0; j < this.dayslist[i].timelist.length; j++) {
				this.dayslist[i].timelist[j].selected = checked;
			}
		}

	}
	WholeDayselet(event, name) {
		const checked = event.target.checked;
		let selecteddays = this.dayslist.filter(x => x.Day == name);
		if (event.target.value) {
			selecteddays[0].timelist.forEach(item => item.selected = checked);
		}
		if (checked) {
			selecteddays[0].selected = true;
			selecteddays[0].wholeday = 1;
			this.weekElementRef.nativeElement.checked = this.dayslist.every((e) => {
				return e.selected == true
			})
		} else {
			selecteddays[0].selected = false;
			selecteddays[0].wholeday = 0;
			this.weekElementRef.nativeElement.checked = checked;
		}
	}
	timeslot(event, dayselect, timeselect) {
		for (var i = 0; i < this.dayslist.length; i++) {
			if (this.dayslist[i].Day == dayselect.Day) {
				for (var j = 0; j < this.dayslist[i].timelist.length; j++) {
					if (this.dayslist[i].timelist[j].time == timeselect.time) {
						this.dayslist[i].timelist[j].selected = event.target.checked;
					}
				}
				let wholedayselect = this.dayslist[i].timelist.every(e => {
					return e.selected == true;
				})
				wholedayselect == true ? this.dayslist[i].wholeday = 1 : this.dayslist[i].wholeday = 0;
			}
		}
	}
	adddocument() {

	}
	loadmap() {
		this.mapsAPILoader.load().then(() => {
			this.setCurrentLocation();
			this.geoCoder = new google.maps.Geocoder;
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					//get the place result
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();
					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					//set latitude, longitude and zoom
					this.latitude = place.geometry.location.lat();
					this.longitude = place.geometry.location.lng();
					this.zoom = 12;
					this.updatableplace = place;
				});
			});

		});

	}
	private setCurrentLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
				this.zoom = 8;
				this.getAddress(this.latitude, this.longitude);
				// this.geocode();
			});
		}
	}
	getAddress(latitude, longitude) {
		this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
			if (status === 'OK') {
				if (results[0]) {
					this.zoom = 12;
					this.address = results[0].formatted_address;
				} else {
					window.alert('No results found');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}

		});
	}
	geocode() {
		const geocoder = new google.maps.Geocoder();

		const latlng = new google.maps.LatLng(this.latitude, this.longitude);

		geocoder.geocode({ 'location': latlng }, (results, status) => {
			if (status === google.maps.GeocoderStatus.OK) {
				console.log(results[0])
				if (results[0] && results[0].address_components && results[0].address_components.length > 0) {
					this.agm_address['zipcode'] = results[0].address_components[8].long_name;
					this.agm_address['country'] = results[0].address_components[7].long_name;
					this.agm_address['state'] = results[0].address_components[6].long_name;
					this.agm_address['city'] = results[0].address_components[5].long_name;
					this.agm_address['line3'] = results[0].address_components[3].long_name;
					this.agm_address['line2'] = results[0].address_components[2].long_name;
					this.agm_address['line1'] = results[0].address_components[1].long_name;
				}
			}
		});
	}
	markerDragEnd($event: MouseEvent) {
		this.latitude = $event.coords.lat;
		this.longitude = $event.coords.lng;
		this.getAddress(this.latitude, this.longitude);
	}
	saveaccdata(bankform) {
		bankform.submitted = true;
		this.bankinfosave.id = this.editid;
		this.bankinfosave.banking.acc_holder_name = bankform.form.value.acc_holder_name;
		this.bankinfosave.banking.acc_number = bankform.form.value.acc_number;
		this.bankinfosave.banking.bank_name = bankform.form.value.bank_name;
		this.bankinfosave.banking.routing_number = bankform.form.value.routing_number;
		if (this.experteditdata.phone.code == +1 || this.experteditdata.country_code == 'US') {
			this.bankinfosave.banking.ssn_number = bankform.form.value.ssn_number;
		} else {
			delete this.bankinfosave.banking.ssn_number;
		}

		if (bankform.form.status == 'VALID') {
			this.buttonDisabled = true;
			this.buttonState = 'show-spinner';
			this.AdminService.CommonApi('post', Apiconfig.taskerbankinfo, this.bankinfosave).subscribe
				((results) => {
					this.buttonDisabled = false;
					this.buttonState = 'show-spinner';
					if (results.status == 1) {
						this.notifications.create('Success', 'Bank Details Updated Successfully', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
						this.ngOnInit();
					} else {
						this.notifications.create('Error', 'Unable to save data', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
					}
					(error) => {
						this.buttonState = '';
						this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
					}
				})
		} else {
			this.buttonDisabled = false;
			this.buttonState = '';
			this.notifications.create('Error', 'please fill all fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		}
	}
	updateworkinginfo() {
		if (!this.address) {
			this.address_err = 'Address is required'
			return;
		}
		this.address_err = '';
		let selectcheck = this.dayslist.filter(x => x.selected == true);
		var workingdays = [] as any;
		for (let i = 0; i < selectcheck.length; i++) {
			let testdata = []
			selectcheck[i].timelist.forEach((item, index) => {
				if (item.selected === true) {
					testdata.push(index)
				}
			});
			workingdays.push({ slots: testdata, day: selectcheck[i].Day, selected: selectcheck[i].selected, wholeday: selectcheck[i].wholeday })
		}

		if (selectcheck.length > 0) {
			var data = {}
			if (this.address == this.experteditdata.availability_address) {
				data = {
					_id: this.editid,
					working_days: workingdays,
					provider_location: { provider_lat: this.experteditdata.location.lat, provider_lng: this.experteditdata.location.lng },
					location: { lng: this.experteditdata.location.lng, lat: this.experteditdata.location.lat },
					availability_address: this.address,
					type: 'doc',
					address: this.agm_address
				};
			} else {
				data = {
					_id: this.editid,
					working_days: workingdays,
					provider_location: { provider_lat: this.latitude, provider_lng: this.longitude },
					location: { lng: this.longitude, lat: this.latitude },
					availability_address: this.address,
					type: 'doc',
					address: this.agm_address
				};
			}
		};
		return data;
	}
	onSubmit() {
		this.DateCheck();
		if (this.agelimitbar == true) {
			this.notifications.create('Error', 'Age should be 18 or more!', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			return;
		}
		var working = {} as any;
		working = this.updateworkinginfo();
		let generalform = this.form.form.value;
		let profiledatasquslist = [];
		for (let index = 0; index < this.experteditpagetwodata.length; index++) {
			profiledatasquslist.push({ answer: this.experteditpagetwodata[index].answer, question: this.experteditpagetwodata[index]._id })
		}
		this.taskerupdatedata.id = this.editid;
		this.taskerupdatedata.email = generalform.email;
		this.taskerupdatedata.firstname = generalform.firstname;
		this.taskerupdatedata.lastname = generalform.lastname;
		this.taskerupdatedata.gender = generalform.gender;
		this.taskerupdatedata.status = generalform.status;
		this.taskerupdatedata.avatarBase64 = this.imagepreview.image ? this.imagepreview.image : '';
		this.taskerupdatedata.username = generalform.firstname + ' ' + generalform.lastname;
		this.taskerupdatedata.birthdate = {
			date: moment(generalform.basicDate).format('DD'),
			month: moment(generalform.basicDate).format('MM'),
			year: moment(generalform.basicDate).format('YYYY')
		}
		console.log(this.updatableplace,'this.updatableplace---------------');
		
		if (this.updatableplace != undefined) {
			this.taskerupdatedata.address.line1 = this.updatableplace.address_components[0].long_name;
			this.taskerupdatedata.address.line2 = this.updatableplace.address_components[1].long_name;
			this.taskerupdatedata.address.line3 = this.updatableplace.address_components[2].long_name;
			this.taskerupdatedata.address.city = this.updatableplace.address_components[3].long_name;
			this.taskerupdatedata.address.state = this.updatableplace.address_components[4].long_name;
			this.taskerupdatedata.address.country = this.updatableplace.address_components[5].long_name;
			this.taskerupdatedata.address.zipcode = this.updatableplace.address_components[6].long_name;
			this.taskerupdatedata.address.formatted_address = this.updatableplace.formatted_address;
			this.taskerupdatedata.availability_address = this.updatableplace.formatted_address;
			this.taskerupdatedata.country_code = this.updatableplace.address_components[5].short_name;
		} else {
			console.log(this.experteditdata,'experteditdata');
			
			// this.taskerupdatedata.address.line1 = this.experteditdata.address.line1;
			// this.taskerupdatedata.address.line2 = this.experteditdata.address.line2;
			// this.taskerupdatedata.address.line3 = this.experteditdata.address.line3;
			// this.taskerupdatedata.address.city = this.experteditdata.address.city;
			// this.taskerupdatedata.address.state = this.experteditdata.address.state;
			// this.taskerupdatedata.address.country = this.experteditdata.address.country;
			// this.taskerupdatedata.address.zipcode = this.experteditdata.address.zipcode;
			this.taskerupdatedata.address = this.experteditdata.address;
			// this.taskerupdatedata.address.formatted_address = this.experteditdata.formatted_address?this.experteditdata.formatted_address:this.experteditdata.availability_address;
			
			if((this.taskerupdatedata.address&&this.taskerupdatedata.address.formatted_address)){
			 this.taskerupdatedata.address.formatted_address = this.experteditdata.formatted_address?this.experteditdata.formatted_address:this.experteditdata.availability_address;

			}else{
				this.taskerupdatedata.address={} as any
		
				this.taskerupdatedata.address.line1= ''
				this.taskerupdatedata.address.line2= ''
				this.taskerupdatedata.address.city= ''
				this.taskerupdatedata.address.state= ''
				this.taskerupdatedata.address.country= ''
				this.taskerupdatedata.address.zipcode= ''
				this.taskerupdatedata.address.formatted_address= ''
			this.taskerupdatedata.address.formatted_address = this.experteditdata.formatted_address?this.experteditdata.formatted_address:this.experteditdata.availability_address;

			}
			this.taskerupdatedata.availability_address = this.addressform.form.value.address;
			this.taskerupdatedata.country_code = this.experteditdata.country_code;
		}
		this.taskerupdatedata.taskerskills = this.experteditdata.taskerskills;
		this.taskerupdatedata.doc = this.experteditdata.doc;
		this.taskerupdatedata.role = this.experteditdata.role;
		if (working != undefined) {
			this.taskerupdatedata.location = working.location;
			this.taskerupdatedata.working_days = working.working_days;
		} else {
			this.taskerupdatedata.location = this.experteditdata.location;
			this.taskerupdatedata.working_days = this.experteditdata.working_days;
		}
		this.taskerupdatedata.profile_details = profiledatasquslist;
		this.taskerupdatedata.phone.code = '+91';
		this.taskerupdatedata.phone.number = this.experteditdata.phone.number;
		this.taskerupdatedata.avatarBase64 = this.imagepreview.image ? this.imagepreview.image : '';
		// this.taskersavedata.append('info',JSON.stringify(this.taskerupdatedata));
		this.AdminService.CommonApi('post', Apiconfig.taskersave, this.taskerupdatedata).subscribe
			((results) => {
				if (results.status == 1) {
					this.buttonDisabled = true;
					this.buttonState = 'show-spinner';
					this.notifications.create('Success', 'Profile Updated Successfully', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
					setTimeout(() => {
						this.router.navigate(['app/experts/taskers/taskerlist']);
					}, 1000);
					this.ngOnInit();
				} else {
					this.buttonState = '';
					this.notifications.create('Error', results.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
				}
				(error) => {
					this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
				}
			})
	}
}
