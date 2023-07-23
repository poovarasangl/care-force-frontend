import { Component, OnInit, ViewChild, ElementRef, NgZone, TemplateRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { AlertService } from '../alert/alert.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { TaskerRegisterService } from './tasker-register.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StoreService } from '../store/store.service';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

@Component({
	selector: 'app-tasker-register',
	templateUrl: './tasker-register.component.html',
	styleUrls: ['./tasker-register.component.sass', '../../../node_modules/ngx-bootstrap/datepicker/bs-datepicker.css'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskerRegisterComponent implements OnInit {

	@ViewChild('search') searchElementRef: ElementRef;
	@ViewChild('allWeek') weekElementRef: ElementRef;
	fileData: any;
	categoryRate: any;
	previewUrl: string | ArrayBuffer;
	Prosonalinfo: FormGroup;
	Workinfoform: FormGroup;
	documenttaskerForm: FormGroup;
	categorytaskerForm: FormGroup;
	categoryedittaskerForm: FormGroup;
	Getdocumentdetails = {
		status: 0,
		doccond: 0,
		response: {}
	} as any;
	submitted: boolean;
	Workinfoforsubmit: boolean;
	errors: any;
	PersonalInfotab = true;
	WorkInfo = false;
	DocumentsInfo = false;
	Category = false;
	maxDate: Date = new Date();
	minDate: Date;
	myDateValue: any;
	email: any;
	Prosonalinfodatalist = {
		firstname: '',
		lastname: '',
		email: '',
		bdate: '',
		gender: '',
	} as any;
	wholeday: any;
	// google maps zoom level
	latitude: number;
	longitude: number;
	zoom: number;
	address: string;
	private geoCoder;
	reg_btn = 0;
	agm_address ={
		line1:'',
		line2: '',
		city: '',
		state: '',
		country: '',
		zipcode: '',
		formatted_address: ''
	}
	// unamePattern = "/^[a-zA-Z]*$/";
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

	showcheckbox: '';
	Voters_ID = {
		Allowed: 0,
		size: 0
	} as any;
	Aadhar_ID = {
		Allowed: 0,
		size: 0
	} as any;
	PAN_Number = {
		Allowed: 0,
		size: 0
	} as any;
	required: any;
	docfileData = [];
	Selectdocimage: any;
	modalRef: BsModalRef;
	categorysubmitted = false;
	Categorylist: any;
	Subcategory: any;
	manicategory = false;
	subcategory = false;
	Docsubmitbtn = false;
	experiencelist: any;
	Categoryinfoform: any;
	editcategoryform: any;
	commision = '';
	commisionrate: any;
	address_err = '';
	bdatedate: any;
	routerurl: string = '';
	zip_code: any;
	@ViewChild('bdaydate') bdaydate: ElementRef;
	@ViewChild('filetag') filetag: ElementRef;

	constructor(private toastr: AlertService,
		private formBuilder: FormBuilder,
		private ApiService: TaskerRegisterService,
		private modalService: BsModalService,
		private storeService: StoreService,
		private router: Router,
		private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone,
		private cd: ChangeDetectorRef,
		private sweetalert: ConfirmDialogService) {
		this.Prosonalinfo = this.formBuilder.group({
			firstname: ['', [Validators.required]],
			lastname: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			bdate: ['', [Validators.required]],
			gender: ['', [Validators.required]],
			avatar: ['']
		});

		this.Workinfoform = this.formBuilder.group({
			workingdays: ['', [Validators.required]],
			Wholedays: ['', [Validators.required]],
			selectedtime: [''],
			address: ['', [Validators.required]]
		});
		this.routerurl = this.router.url;
		this.storeService.Url.next(this.routerurl);
		this.maxDate = new Date();

		// const script3 = document.createElement('script');
		// script3.type = 'text/javascript';
		// script3.src = 'assets/datepicker/datepicker.js';
		// this.elementRef.nativeElement.appendChild(script3);
	}
	ngOnInit() {
		
		this.categorytaskerForm = this.formBuilder.group({
			manicategory: ['', [Validators.required]],
			subcategory: ['', [Validators.required]],
			rate: ['', [Validators.required]],
			explevel: ['', [Validators.required]],
		});
		this.categoryedittaskerForm = this.formBuilder.group({
			manicategory: ['', [Validators.required]],
			subcategory: ['', [Validators.required]],
			rate: ['', [Validators.required]],
			explevel: ['', [Validators.required]],
		});
		//localStorage.removeItem('Categoryinfo')
		this.Categorylist = JSON.parse(localStorage.getItem('categories'));
		this.Categoryinfoform = JSON.parse(localStorage.getItem('Categoryinfo'));
		this.storeService.landingdata.subscribe((landing: any) => {
			if (this.Categorylist == null) {
				this.Categorylist = landing.categories;
				localStorage.setItem('categories', JSON.stringify(this.Categorylist));
			}
		})

		this.ApiService.Getdocumentdetails().subscribe(result => {
			this.Getdocumentdetails = result;
			console.log(this.Getdocumentdetails);
			
			if (localStorage.getItem('Prosonalinfo')) {
				this.PersonalInfotab = false;
				this.Prosonalinfodatalist = JSON.parse(localStorage.getItem('Prosonalinfo'));
				this.WorkInfo = true;
				this.DocumentsInfo = false;
				if (localStorage.getItem('WorkInfo')) {
					this.WorkInfo = false;
					if (this.Getdocumentdetails.doccond == 1) {
						if (localStorage.getItem('DocumentsInfo')) {
							this.Category = true;
						} else {
							this.DocumentsInfo = true;
						}
					} else {
						this.Category = true;
					}
				}
			}
			let group = {}
			if (result.doccond === 1) {
				result.response.forEach(template => {
					if (template.mandatory == 1) {
							group[template.replace_name] = new FormControl('', Validators.required);
							group[template.replace_name_back] = new FormControl('', Validators.required);
						} else {
								group[template.replace_name] = new FormControl('');
								group[template.replace_name_back] = new FormControl('');
							}
				})
			}
			this.documenttaskerForm = new FormGroup(group);
			this.cd.detectChanges();
		});

		this.mapsAPILoader.load().then(() => {
			this.setCurrentLocation();
			this.geoCoder = new google.maps.Geocoder;
			let autocomplete;
			autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ["address"]
			});


			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					//get the place result
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();
					if (this.address) {
						localStorage.setItem('availability_address', this.address);
						this.agm_address['formatted_address'] = this.address;
					}
					//verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}

					//set latitude, longitude and zoom
					this.latitude = place.geometry.location.lat();
					this.longitude = place.geometry.location.lng();
					this.zoom = 12;
					this.geocode();
				});
			});
		});
	}
	// Get Current Location Coordinates
	private setCurrentLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
				this.zoom = 8;
				this.getAddress(this.latitude, this.longitude);
				this.geocode();
			});
		}
	}

	closeAdd() {
		// this.categorytaskerForm.reset();
		this.categorytaskerForm.setValue({
			manicategory: '',
			subcategory: '',
			rate: '',
			explevel: '',
		})
		this.modalRef.hide()
	}

	geocode() {
		const geocoder = new google.maps.Geocoder();
	  
		const latlng = new google.maps.LatLng(this.latitude, this.longitude);
	  
		geocoder.geocode({ 'location': latlng }, (results, status) => {
			if (status === google.maps.GeocoderStatus.OK) {
		
				if (results[0]) {
					this.agm_address['zipcode'] = results[0].address_components[results[0].address_components.length - 1].long_name;
					this.agm_address['country'] = results[0].address_components[results[0].address_components.length - 2].short_name;
					this.agm_address['state'] = results[0].address_components[results[0].address_components.length - 3].long_name;
					this.agm_address['city'] = results[0].address_components[results[0].address_components.length - 4].long_name;
					this.agm_address['line2'] = results[0].address_components[results[0].address_components.length - 5].long_name;
					this.agm_address['line1'] = results[0].address_components[results[0].address_components.length - 6].long_name;
					
				}
			}
		  });
	}

	markerDragEnd($event: MouseEvent) {
		this.latitude = $event.coords.lat;
		this.longitude = $event.coords.lng;
		this.getAddress1(this.latitude, this.longitude);
		this.geocode();
	}
	getAddress1(latitude, longitude) {
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
	getAddress(latitude, longitude) {
		this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
			if (status === 'OK') {
				if (results[0]) {
					this.zoom = 12;
					//this.address = results[0].formatted_address;
				} else {
					window.alert('No results found');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}

		});
	}
	fileupload(event) {
		const imgbytes = event.target.files[0].size;
		if (event.target.files[0].type == "image/jpeg" || "image/png") {
			if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
				this.errorsmsg('Maximum of this file');
			} else {
				this.fileData = <File>event.target.files[0];
				var formData = new FormData();
				formData.append('file', event.target.files[0]);
				this.ApiService.Getdocumentfilepath(formData).subscribe(result => {
					this.Prosonalinfo.value.avatar = result.response[0].path;
				})
				this.successmsg("Uploading...");
				this.preview();				
			}
		} else {
			this.errorsmsg("File type is not supported");
		}
	}

	preview() {
		// Show preview
		var mimeType = this.fileData.type;
		if (mimeType.match(/image\/*/) == null) {
			return;
		}

		var reader = new FileReader();
		reader.readAsDataURL(this.fileData);
		reader.onload = (_event) => {
			this.previewUrl = reader.result;
		}
	}

	PersonalInfobtn() {
		this.PersonalInfotab = true;
		this.WorkInfo = false;
		this.DocumentsInfo = false;
		this.Category = false;
	}

	WorkInfobtn() {
		var Prosonalinfodata = JSON.parse(localStorage.getItem('Prosonalinfo'));
		if (Prosonalinfodata) {
			this.PersonalInfotab = false;
			this.WorkInfo = true;
			this.DocumentsInfo = false;
			this.Category = false
		} else {
			// this.PersonalInfotab = true;
			// this.WorkInfo = false;
			// this.DocumentsInfo = false;
			// this.Category = false
			this.errorsmsg('Please Fill The mandatory fields first')
		}
	}

	DocumentsInfobtn() {
		var Prosonalinfodata = JSON.parse(localStorage.getItem('Prosonalinfo'));
		var WorkInfodata = JSON.parse(localStorage.getItem('WorkInfo'));
		if (Prosonalinfodata && WorkInfodata) {
			this.PersonalInfotab = false;
			this.WorkInfo = false;
			this.DocumentsInfo = true;
			this.Category = false
		} else {
			// this.PersonalInfotab = true;
			// this.WorkInfo = false;
			// this.DocumentsInfo = false;
			// this.Category = false
			this.errorsmsg('Please Fill The mandatory fields first')
		}
	}

	Categorybtn() {
		var Prosonalinfodata = JSON.parse(localStorage.getItem('Prosonalinfo'));
		var WorkInfodata = localStorage.getItem('WorkInfo');
		var DocumentsInfodata = JSON.parse(localStorage.getItem('DocumentsInfo'));
		if (Prosonalinfodata && WorkInfodata && DocumentsInfodata) {
			this.PersonalInfotab = false;
			this.WorkInfo = false;
			this.DocumentsInfo = false;
			this.Category = true;
		} else {
			// this.PersonalInfotab = true;
			// this.WorkInfo = false;
			// this.DocumentsInfo = false;
			// this.Category = false;
			this.errorsmsg('Please Fill The mandatory fields first')
		}
	}

	emailcheck(event) {
		var data = {
			email: event.target.value,
			table: 'tasker'
		}
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)) {
			this.ApiService.checkemail(data).subscribe(result => {
				if (result.status == 0) {
					this.Prosonalinfo.controls['email'].setValue('');
					this.errorsmsg(result.response);
				}
			})
		} else {
			this.Prosonalinfo.controls['email'].setErrors({ 'email': true });
			//this.errors = 1;
		}
	}

	dateSelectedend(date) {
		var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
		if (date.match(dateformat) == null) {
			this.warningmsg('Date is not valid');
		}
		if (event != null) {
			this.bdatedate = date;
			let selecteddate = new Date(date);
			let newdate = new Date();
			var Difference_In_Time = newdate.getTime() - selecteddate.getTime();
			if (Difference_In_Time) {
				let age = Math.floor((Difference_In_Time / (1000 * 3600 * 24)) / 365.25);
				if (18 >= age) {
					this.warningmsg('Your Age Should Be 18+');
					this.bdatedate = '';
				}
			} else {
				this.bdatedate = '';
				this.warningmsg('Your Age Should Be 18+');
			}
		}
	}

	validDate(event) {
		if (event) {
			var today = new Date();
			var birthDate = new Date(event);
			var age = today.getFullYear() - birthDate.getFullYear();
			if (age < 18) {
				this.bdatedate = '';
				this.Prosonalinfo.controls['bdate'].setValue('');
				this.warningmsg('Your Age Should Be 18+');
			}
		}
	}

	get prosonalsubmit() { return this.Prosonalinfo.controls; }
	onSubmit() {
		// this.Prosonalinfo.controls['bdate'].setValue(this.bdaydate.nativeElement.value);
		this.submitted = true;
		if (this.Prosonalinfo.invalid) {
			return;
		}
		let selecteddate = new Date(this.Prosonalinfo.value.bdate);
		let newdate = new Date();
		var Difference_In_Time = newdate.getTime() - selecteddate.getTime();
		if (Difference_In_Time && this.Prosonalinfo.value.bdate) {
			let age = Math.floor((Difference_In_Time / (1000 * 3600 * 24)) / 365.25);
			if (18 >= age) {
				this.warningmsg('Your Age Should Be 18+');
				this.bdatedate = '';
				return;
			}
		}
		this.PersonalInfotab = false;
		this.WorkInfo = true;
		window.scrollTo(0, 0)
		localStorage.setItem('Prosonalinfo', JSON.stringify(this.Prosonalinfo.value));
	}
	test(event, name) {
		this.showcheckbox = name;
	}
	WholeDay(event, name) {
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

	submitfun() {
		this.Workinfoforsubmit = true;
		if (!this.address) {
			this.address_err = 'Address is required'
			return;
		}
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
			localStorage.setItem('WorkInfo', JSON.stringify(workingdays));
			this.PersonalInfotab = false;
			this.WorkInfo = false;
			if (this.Getdocumentdetails.doccond == 1) {
				this.DocumentsInfo = true;
			} else {
				this.Category = true;
			}
		} else if (selectcheck.length == 0) {
			if (!this.wholeday) {
				this.warningmsg('Please Select Atleast One Day');
				return;
			}
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
		if (this.dayslist.filter(x => x.wholeday == 0).length > 0) {
			this.weekElementRef.nativeElement.checked = false;
		} else if (this.dayslist.filter(x => x.wholeday == 1).length > 6) {
			this.weekElementRef.nativeElement.checked = true;
		}

	}

	imagechangefun(event, replace_name) {
		const imgbytes = event.target.files[0].size;
		var doclist = this.Getdocumentdetails.response;
		//this.filetag.nativeElement.value = event.target.files[0];
		
		for (var i = 0; i < doclist.length; i++) {
			if (doclist[i].replace_name == replace_name) {
				this.documenttaskerForm.controls[doclist[i].replace_name].setValue(event.target.files[0].name, { emitModelToViewChange: false });
			} else if (doclist[i].replace_name_back == replace_name) {
				this.documenttaskerForm.controls[doclist[i].replace_name_back].setValue(event.target.files[0].name, { emitModelToViewChange: false });
			}
			 else {
				if (this.documenttaskerForm.value[doclist[i].replace_name] == '') {
					this.documenttaskerForm.controls[doclist[i].replace_name].setValue('', { emitModelToViewChange: false });
				}
			}
		}
		const file = event.target.files[0];
		const fileType = file['type'];
		const docValid = file.name.split('.');
		if (fileType == "image/png" || fileType == "image/jpeg" || fileType == "image/jpg" || fileType == "application/pdf" || docValid[1] == "doc" || docValid[1] == "docx") {
			let selected_doc = doclist.filter(x => x.replace_name == replace_name || x.replace_name_back == replace_name);
			var imagetype = [];
			var imagename = [];
			if (selected_doc.length > 0 && selected_doc[0].file_types) {
				for (var i = 0; i < selected_doc[0].file_types.length; i++) {
					imagetype.push(selected_doc[0].file_types[i].ftype);
					imagename.push(selected_doc[0].file_types[i].name);
				}
				const validImageTypes = imagetype;
				if (validImageTypes.includes(fileType)) {
					if (Math.round(parseInt(imgbytes) / 3072) > 3072) {
						this.documenttaskerForm.value[replace_name] = '';
						this.errorsmsg('Allowed file size should be lesser than 3 MB');
					} else {
						var formData = new FormData();
						formData.append('file', event.target.files[0]);
						
						this.ApiService.Getdocumentfilepath(formData).subscribe(result => {
							let samefile = this.docfileData.findIndex(x => x.name == replace_name || x.replace_name == replace_name || x.replace_name_back == replace_name);
							
							if (samefile > -1) {
								this.docfileData[samefile].path = result.response[0].path;
								this.docfileData[samefile].name = replace_name;
								this.docfileData[samefile].file_type = result.response[0].mimetype;
								this.docfileData[samefile].replace_name = replace_name;
							} else {
								setTimeout(() => {
									this.docfileData.push({ _id: selected_doc[0]._id, path: result.response[0].path, name: selected_doc[0].name, file_type: result.response[0].mimetype, replace_name: replace_name, stripe: selected_doc[0].stripe  });
								}, 500);
							}
						})
					}
				} else {
					this.documenttaskerForm.value[replace_name] = '';
					//this.errorsmsg('Allowed files:' + imagename.join().toUpperCase());
				}
			} else {
				var formData = new FormData();
				formData.append('file', event.target.files[0]);
				this.ApiService.Getdocumentfilepath(formData).subscribe(result => {
					let samefile = this.docfileData.findIndex(x => x.name == replace_name || x.replace_name == replace_name || x.replace_name_back == replace_name);
					if (samefile > -1) {
						this.docfileData[samefile].path = result.response[0].path;
						this.docfileData[samefile].name = replace_name;
						this.docfileData[samefile].file_type = result.response[0].mimetype;
						this.docfileData[samefile].replace_name = replace_name;

					} else {
						setTimeout(() => {
							this.docfileData.push({ _id: selected_doc[0]._id, path: result.response[0].path, name: replace_name, file_type: result.response[0].mimetype, replace_name: replace_name, stripe: selected_doc[0].stripe  });
						}, 500);
					}
				})
			}
		} else {
			this.documenttaskerForm.controls[replace_name].setValue('', { emitModelToViewChange: false });
			this.errorsmsg("File uploaded must be a pdf, docx, doc or image")
		}
	}

	Docsubmit() {
		this.Docsubmitbtn = true;
		if (this.documenttaskerForm.invalid) {
			return;
		} else {
			let data = this.docfileData;
			localStorage.setItem('DocumentsInfo', JSON.stringify(data));
			this.PersonalInfotab = false;
			this.WorkInfo = false;
			this.DocumentsInfo = false;
			this.Category = true;
		}
	}
	openModal(template: TemplateRef<any>) {
		this.manicategory = false;
		this.subcategory = false;
		this.Categorylist = JSON.parse(localStorage.getItem('categories'));
		this.modalRef = this.modalService.show(template);
		this.ApiService.Getexperiencedetailas().subscribe(result => {
			if (result.status == 1) {
				this.experiencelist = result.response;
			}
		})
	}

	Categorychange(event) {
		if (event.target.value != '') {
			this.getsubcategory(event.target.value, 'add');
		}
	}
	getsubcategory(id, add_edit) {
		this.manicategory = true;
		let selectcategory = this.Categorylist.filter(x => x._id == id);
		// let addcat = JSON.parse(localStorage.getItem('Categoryinfo')).map(x=> x.subcategory);
		// console.log(addcat);

		const data = {
			slug: selectcategory[0].slug
		};
		this.ApiService.Getsubcategory(data).subscribe(result => {
			if (result.status === 1) {
				this.Subcategory = result.response;
				if (add_edit == 'add') {
					let added_data = JSON.parse(localStorage.getItem('Categoryinfo')) ? JSON.parse(localStorage.getItem('Categoryinfo')) : [];
					if (added_data.length > 0) {
						for (var i = 0; i < added_data.length; i++) {
							if (id == added_data[i].manicategory) {
								this.Subcategory = this.Subcategory.filter(x => x._id != added_data[i].subcategory);
							}
						}
					}
				}
			}
		});
	}
	subcategorycommision(event) {
		let data = this.Subcategory.filter(x => x._id == event.target.value);
		this.categoryRate = data[0].ratetype;
		this.commisionrate = data[0].commision;
		if (this.categoryRate == 'Flat') {
			this.categorytaskerForm.controls['rate'].setValue(this.commisionrate);
		}
	}
	checkcommision(event) {
		if (this.commisionrate > event.target.value) {
			this.commision = `Minimum Flat Rate Should Be $ ${this.commisionrate}.`
		} else if (this.commisionrate == event.target.value) {
			this.commision = '';
		} else {
			this.commision = '';
		}
	}
	get categoryformdata() { return this.categorytaskerForm.controls; }
	categorysubmit() {
		this.categorysubmitted = true;
		if (this.categorytaskerForm.invalid) {
			return;
		}
		this.modalRef.hide();
		let priviousvalue = JSON.parse(localStorage.getItem('Categoryinfo'));
		let data = [];
		let cat = this.categorytaskerForm.value;
		cat.commisionrate = this.commisionrate;
		cat.categoryRate = this.categoryRate;
		data.push(cat);
		if (priviousvalue) {
			for (let i = 0; i < priviousvalue.length; i++) {
				data.push(priviousvalue[i]);
			}
		}
		localStorage.setItem('Categoryinfo', JSON.stringify(data));
		this.Categoryinfoform = JSON.parse(localStorage.getItem('Categoryinfo'));
		this.ngOnInit();
		this.categorysubmitted = false;
	}
	getcategoryname(categiryid) {
		let value = this.Categorylist.filter(x => x._id == categiryid);
		return value[0].name;
	}
	// getsubcategoryname(subcategiryid){
	// 	let value = this.Subcategory.filter(x => x._id == subcategiryid);
	// 	return value[0].name;
	// }
	deletecategory(id) {
		this.sweetalert.confirmThis("Are you sure to delete this Category?", () => {
			this.deletedfun(id);
		}, () => {
			//alert("No clicked");  
		});
	}
	deletedfun(id) {
		for (let i = 0; i < this.Categoryinfoform.length; i++) {
			if (id == this.Categoryinfoform[i].manicategory) {
				this.Categoryinfoform.splice(i, 1);
			}
		}
		localStorage.setItem('Categoryinfo', JSON.stringify(this.Categoryinfoform));
	}
	editcategory(editcategorymodel: TemplateRef<any>, id) {
		let data = this.Categoryinfoform.filter(x => x.manicategory == id);
		this.editcategoryform = data[0];

		this.categoryedittaskerForm.controls['rate'].setValue(this.editcategoryform.rate);
		this.getsubcategory(data[0].manicategory, 'edit');
		this.ApiService.Getexperiencedetailas().subscribe(result => {
			if (result.status == 1) {
				this.experiencelist = result.response;
			}
		});
		this.modalRef = this.modalService.show(editcategorymodel);
	}
	checkcommisionedit(event, subcat_id) {
		let subcategoryid = this.Subcategory.filter(x => x._id == subcat_id);
		this.commisionrate = subcategoryid[0].commision;
		if (this.commisionrate > event.target.value) {
			this.commision = `Minimum Flat Rate Should Be $ ${this.commisionrate}.`
		} else if (this.commisionrate == event.target.value) {
			this.commision = '';
		} else {
			this.commision = '';
		}
	}

	get categoryeditformdata() { return this.categoryedittaskerForm.controls; }
	categoryeditsubmit() {
		if (this.categoryedittaskerForm.invalid) {
			return;
		}
		let data = [];
		this.modalRef.hide();
		let categoryid = this.categoryedittaskerForm.value.manicategory;
		for (let i = 0; i < this.Categoryinfoform.length; i++) {
			if (this.Categoryinfoform[i].manicategory == categoryid) {
				data.push(this.categoryedittaskerForm.value);
			} else {
				data.push(this.Categoryinfoform[i]);
			}
		}
		this.Categoryinfoform = data;
		localStorage.setItem('Categoryinfo', JSON.stringify(data));
		this.ngOnInit();
	}
	registertasker() {
		if (localStorage.getItem('Categoryinfo') && JSON.parse(localStorage.getItem('Categoryinfo')).length == 0){
			this.errorsmsg('Please Choose A Catagory');
			return false;
		}
		this.reg_btn = 1;
		let Prosonalinfo = JSON.parse(localStorage.getItem('Prosonalinfo'));
		let WorkInfo = JSON.parse(localStorage.getItem('WorkInfo'));
		let DocumentsInfo = JSON.parse(localStorage.getItem('DocumentsInfo'));
		let Categoryinfo = JSON.parse(localStorage.getItem('Categoryinfo'));
		let registerphone = JSON.parse(localStorage.getItem('registerphone'));
		let taskerskills = [];
		for (let i = 0; i < Categoryinfo.length; i++) {
			taskerskills[i] = {
				categoryid: Categoryinfo[i].manicategory,
				childid: Categoryinfo[i].subcategory,
				hour_rate: Categoryinfo[i].rate,
				experience: Categoryinfo[i].explevel,
				status: 1
			}
		}
		let data = {
			Prosonalinfo: Prosonalinfo,
			working_days: WorkInfo,
			doc: DocumentsInfo,
			taskerskills: taskerskills,
			registerphone: registerphone,
			provider_location: { provider_lat: this.latitude, provider_lng: this.longitude },
			location: { lng: this.longitude, lat: this.latitude },
			availability_address: localStorage.getItem('availability_address'),
			address: this.agm_address
		};
		this.ApiService.taskerRegister(data).subscribe(result => {
			if (result.status == 1) {
				let keysToRemove = ["Prosonalinfo", "WorkInfo", "DocumentsInfo", "Categoryinfo", "registerphone"];
				for (let key of keysToRemove) {
					localStorage.removeItem(key);
				}
				result.response.expiresAt = new Date().getTime() + (1000 * 60 * 60 * 12);
				localStorage.setItem('currenttasker', JSON.stringify(result.response));
				this.storeService.Userdetails.next(result.response);
				this.successmsg('Registered Sucessfully!');
				this.router.navigate(['']);
			} else {
				this.errorsmsg(result.response)
			}
		})
	}

	successmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 2000);
		this.toastr.success(msg);
	}
	errorsmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 2000);
		this.toastr.error(msg);
	}
	warningmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 2000);
		this.toastr.warn(msg);
	}
}
