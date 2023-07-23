import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig, AdminService } from "../../../../_services";
import { environment } from "src/environments/environment";
import * as moment from 'moment-timezone';

@Component({
	selector: 'app-general',
	templateUrl: './general.component.html',
	styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
	@ViewChild('form') form: NgForm;
	buttonDisabled = false;
	buttonState = '';
	currentdate: Date = new Date();
	customeDate: string = 'yyyy-MM-dd';
	customTime: string = 'hh:mm a';
	@ViewChild('cutomDateInput') cutomDateInput: ElementRef;
	@ViewChild('cutomTimeInput') cutomTimeInput: ElementRef;
	settingsData: any;
	imageUrl: string = environment.apiUrl;
	dateradiobtn: any = [];
	coustomDateRadiobtn: boolean = false;
	coustomeTimeRadiobtn: boolean = false;
	timeradiobtn: any = [];
	formSettingsData = new FormData();
	referral: any = { amount: {} };
	wallet: any = { amount: {} };
	public tzNames: string[];
	admincommisioninput: boolean = false;
	resttimeinput: boolean = false;
	walletoptioninput: boolean = false;
	referraloptioninput: boolean = false;
	documentinput: boolean = false;
	paybycashinput: boolean = false;
	siteaddress: any;
	imagepreview = {
		logo :'' as string | ArrayBuffer,
		light_logo :'' as string | ArrayBuffer,
		favicon :'' as string | ArrayBuffer		
	}
	spinner = 'none';

	constructor(
		private AdminService: AdminService,
		private notifications: NotificationsService) {
		this.dateradiobtn = [
			{
				name: 'MMMM dd, yyyy',
				value: 'MMMM Do, YYYY',
				checked: false
			},
			{
				name: 'yyyy-MM-dd',
				value: 'YYYY-MM-DD',
				checked: false
			},
			{
				name: 'MM/dd/yyyy',
				value: 'MM/DD/YYYY',
				checked: false
			},
			{
				name: 'dd/MM/yyyy',
				value: 'DD/MM/YYYY',
				checked: false
			},
			{
				name: '',
				value: '',
				checked: false
			},
		]
		this.timeradiobtn = [
			{
				name: 'hh:mm a',
				value: 'hh:mm a',
				checked: false
			},
			{
				name: 'hh:mm',
				value: 'hh:mm',
				checked: false
			},
			{
				name: '',
				value: '',
				checked: false
			},
		]
		this.tzNames = moment.tz.names();
	}


	ngAfterViewInit() {
		this.cutomDateInput.nativeElement.value = 'yyyy-MM-dd';
		this.cutomTimeInput.nativeElement.value = 'hh:mm';
	}
	ngOnInit(): void {
		this.showspinner();
		this.formSettingsData = new FormData();
		this.AdminService.CommonApi('get', Apiconfig.getSettingsData + '?alias=general', {}).subscribe(
			(results) => {
				if (results.status === 1) {
					this.hidespinner();
					this.settingsData = results.response.settings;
					if (this.settingsData && this.settingsData.site_title != 'undefined') {
						this.form.form.controls['site_title'].setValue(this.settingsData.site_title ? this.settingsData.site_title : '');
						this.form.form.controls['email_address'].setValue(this.settingsData.email_address);
						this.form.form.controls['contact_number_one'].setValue(this.settingsData.contact_number_one);
						this.form.form.controls['contact_number_two'].setValue(this.settingsData.contact_number_two);
						this.form.form.controls['site_url'].setValue(this.settingsData.site_url);
						this.form.form.controls['service_tax'].setValue(this.settingsData.service_tax);
						this.form.form.controls['location'].setValue(this.settingsData.location);
						this.form.form.controls['tasker_radius'].setValue(this.settingsData.tasker_radius);
						this.form.form.controls['distanceby'].setValue(this.settingsData.distanceby);
						this.form.form.controls['billingcycle'].setValue(this.settingsData.billingcycle);
						this.form.form.controls['minaccepttime'].setValue(this.settingsData.minaccepttime);
						this.form.form.controls['accepttime'].setValue(this.settingsData.accepttime);
						this.form.form.controls['bookingIdPrefix'].setValue(this.settingsData.bookingIdPrefix);
						this.form.form.controls['time_zone'].setValue(this.settingsData.time_zone);
						this.form.form.controls['map_api'].setValue(this.settingsData.map_api);
						this.form.form.controls['admin_commission'].setValue(this.settingsData.admin_commission ? parseInt(this.settingsData.admin_commission) : 0);
						this.settingsData.resttime.status = this.settingsData.resttime.status ? parseInt(this.settingsData.resttime.status) : 0;
						this.admincommisioninput = this.settingsData.categorycommission.status == 1 ? true : false;
						this.resttimeinput = this.settingsData.resttime.status == '1' ? true : false;
						this.walletoptioninput = this.settingsData.wallet.status == '1' ? true : false;
						if (this.walletoptioninput) {
							this.form.form.controls['wallet_minimum'].setValue(this.settingsData.wallet.amount.minimum);
							this.form.form.controls['wallet_maximum'].setValue(this.settingsData.wallet.amount.maximum);
						}
						this.referraloptioninput = this.settingsData.referral.status == '1' ? true : false;
						if (this.referraloptioninput) {
							this.form.form.controls['referral'].setValue(this.settingsData.referral.amount.referral);
							this.form.form.controls['referrer'].setValue(this.settingsData.referral.amount.referrer);
						}
						this.documentinput = this.settingsData.document_upload.status == '1' ? true : false;
						this.paybycashinput = this.settingsData.pay_by_cash.status == '1' ? true : false;
						//Date Radio
						for (let index = 0; index < this.dateradiobtn.length; index++) {
							if (this.dateradiobtn[index].value == this.settingsData.date_format) {
								this.dateradiobtn[index].checked = true;
							}
						}
						this.coustomDateRadiobtn = this.dateradiobtn.filter(x => x.value == this.settingsData.date_format).length > 0 ? false : true;
						if (this.coustomDateRadiobtn) {
							this.customeDate = this.settingsData.date_format;
						}
						//Time radio
						for (let index = 0; index < this.timeradiobtn.length; index++) {
							if (this.timeradiobtn[index].value == this.settingsData.time_format) {
								this.timeradiobtn[index].checked = true;
							}
						}
						this.coustomeTimeRadiobtn = this.timeradiobtn.filter(x => x.value == this.settingsData.time_format).length > 0 ? false : true;
						if (this.coustomeTimeRadiobtn) {
							this.customTime = this.settingsData.time_format;
						}
					}
				} else {
					console.log('Error', results.response);
				}
			}, (error) => {
				console.log(error);
			})
	}
	RadioChange(event, type) {
		if (type == 'date') {
			this.cutomDateInput.nativeElement.value = event;
		} else {
			this.cutomTimeInput.nativeElement.value = event;
		}
	}
	onKeyup(event, type) {
		if (type == 'date') {
			if (event && typeof event != 'undefined') {
				this.customeDate = event;
			} else {
				this.customeDate = '';
			}
		} else {
			if (event && typeof event != 'undefined') {
				this.customTime = event;
			} else {
				this.customTime = '';
			}
		}
	}
	getFiles(event, key) {
		const imgbytes = event.target.files[0].size;
		const imgtype = event.target.files[0].type;
		this.preview(event.target.files[0],key);
		this.formSettingsData.delete(key);
		if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
			if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
			} else {
				this.formSettingsData.append(key, event.target.files[0], event.target.files[0]['name']);
			}
		} else {

		}
	}
	preview(files,key) {
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

	commissionchange(event) {
		this.admincommisioninput = event.target.checked;
	}
	resttimechange(event) {
		this.resttimeinput = event.target.checked;
	}
	referralinput(event) {
		this.referraloptioninput = event.target.checked;
	}
	walletoption(event) {
		this.walletoptioninput = event.target.checked;
	}
	documentoption(event) {
		this.documentinput = event.target.checked;
	}
	paybycashevent(event) {
		this.paybycashinput = event.target.checked;
	}
	onSubmit() {
		this.showspinner();
		this.buttonDisabled = true;
		//Wallet obj
		this.wallet.amount.minimum = this.form.form.value.wallet_minimum;
		this.wallet.amount.maximum = this.form.form.value.wallet_maximum;
		this.wallet.status = this.walletoptioninput == true ? 1 : 0;
		let generalsettingdata = this.form.form.value;
		generalsettingdata.wallet = this.wallet;
		//Referral obj
		this.referral.amount.referral = this.form.form.value.referral;
		this.referral.amount.referrer = this.form.form.value.referrer;
		this.referral.status = this.referraloptioninput == true ? 1 : 0;
		generalsettingdata.referral = this.referral;

		generalsettingdata.siteaddress = this.form.form.value.location;
		generalsettingdata.categorycommission = {};
		generalsettingdata.document_upload = {};
		generalsettingdata.pay_by_cash = {};
		generalsettingdata.resttime = {};
		generalsettingdata.categorycommission.status = this.admincommisioninput == true ? 1 : 0;
		generalsettingdata.document_upload.status = this.documentinput == true ? 1 : 0;
		generalsettingdata.pay_by_cash.status = this.paybycashinput == true ? 1 : 0;
		generalsettingdata.resttime.status = this.settingsData.status;
		generalsettingdata.date_format = this.cutomDateInput.nativeElement.value;
		generalsettingdata.time_format = this.cutomTimeInput.nativeElement.value;
		if(this.formSettingsData.get('logo') == null){
			generalsettingdata.logo = this.settingsData.logo;
		}
		if(this.formSettingsData.get('light_logo') == null){
			generalsettingdata.light_logo = this.settingsData.light_logo;
		}
		if(this.formSettingsData.get('favicon') == null){
			generalsettingdata.favicon = this.settingsData.favicon;
		}
		if (this.form.form.valid) {
			this.buttonState = 'show-spinner';
			this.formSettingsData.append('info', JSON.stringify(generalsettingdata));
			this.formSettingsData.append('alias', 'general');
			this.AdminService.CommonApi('post', Apiconfig.saveSettingsData, this.formSettingsData).subscribe(
				(data) => {
					this.hidespinner();
					this.buttonDisabled = false;
					this.buttonState = '';
					this.notifications.create('Success', 'General Settings Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
					this.ngOnInit();
				}, (error) => {
					this.hidespinner();
					this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
					console.log(error);
				})
		} else {
			this.hidespinner();
			this.buttonDisabled = false;
			this.buttonState = '';
			this.notifications.create('Error', 'Please enter all madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		}
	}
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}
}
