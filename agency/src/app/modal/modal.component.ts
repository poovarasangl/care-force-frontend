import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalService } from './modal.service';
import { CONFIG } from '../config';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import * as moment from 'moment'
import { StoreService } from '../store/store.service';
import { AccountService } from '../account/account.service';
import jsPDF, * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertService } from '../alert/alert.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit {
  modalcontend: any;
  categoryType: any;
  openreview: any;
  imageUrl = CONFIG.imageUrl;
  carddetailsform: FormGroup
  submitted = false;
  yearlist: any;
  cardnumber_Error: String = ''
  savebtn: number = 0;
  reasons: String = '';
  otherdata: String = '';
  additem: number = 0; // task complete to add item count
  additemamount: Number = 0; // task complete to add item amount
  myForm: FormGroup;
  material: boolean;
  rate = 0;
  comment: String = ''; //review comments enter feild
  editcategoryform: any;
  categorytaskerForm: FormGroup;
  categoryedittaskerForm: FormGroup;
  manicategory = false;
  subcategory: any;
  Categorylist: any;
  Subcategorylist: any;
  experiencelist: any;
  commisionrate: any;
  commision: string = '';
  categorysubmitted: boolean = false;
  Categoryinfoform: any;
  filename = 'No File Chosen';
  editimage: any;
  Getdocumentlist: any;
  imagevalidation = 'black';
  fileData: File;
  previewUrl: string | ArrayBuffer;
  submited: boolean = false;
  profiledata: any;
  otheroptions: any;
  type: any;
  usertype: any;
  arrayControl: any;
  cardname:string ='';
  DefaultCurrency: any;
  editcategory_profile:any;
  

  @ViewChild('pdfData') pdfData: ElementRef;
  @ViewChild('checkbox') checkbox: ElementRef;

  constructor(
    private service: ModalService,
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private store: StoreService,
    private toastr: AlertService,
    private ApiService: AccountService) {

    this.carddetailsform = this.formBuilder.group({
      number: new FormControl('', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]),
      exp_month: ['', [Validators.required]],
      exp_year: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.maxLength(3)]],
    });
    let completedform = this.formBuilder.group({
      formArray: this.formBuilder.array([])
    });
    this.arrayControl = <FormArray>completedform.controls['formArray'];
    for (let i = 0; i > 1; i++) {
      let newGroup = this.formBuilder.group({
        name: [''],
        price: ['']
      });
      this.arrayControl.push(newGroup);
    }
    this.myForm = completedform;
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
    this.manicategory = false;
    this.subcategory = false;

    this.store.category.subscribe(result => {
      this.Categorylist = result;
    });

    this.ApiService.Getexperiencedetailas().subscribe(result => {
      if (result.status == 1) {
        this.experiencelist = result.response;
      }
    });
    this.store.defaultcurrency.subscribe((result:any)=>{
      if(result && result.code){
       this.DefaultCurrency =  result;       
      }
    });
  }

  ngOnInit() {
    this.service.getMessage().subscribe((result: any) => {
      if (result && result.show === 'common') {
        this.modalcontend = result;
        this.usertype = result.usertype;
        this.openreview = result.content;       
        this.elementRef.nativeElement.querySelector('#openModalButton').click();
      } else if (result && result.show === 'wallet') {
        var starttime = moment().startOf('year').format('YYYY');
        const times = 11;
        let timelist = [];
        for (let i = 0; i < times; i++) {
          timelist.push(moment(starttime).add(i, 'year').format('YYYY'));
        }
        this.yearlist = timelist;
        this.modalcontend = result;
        this.elementRef.nativeElement.querySelector('#openModalwallet').click();
      } else if (result && result.show === 'canceljob') {
        this.modalcontend = result;
        this.openreview = result.content;
        this.elementRef.nativeElement.querySelector('#openModalcanceljob').click();
      } else if (result && result.show === 'completedjob') {
        this.modalcontend = result;
        this.openreview = result.content;
        this.elementRef.nativeElement.querySelector('#openModalcompletedjob').click();
      } else if (result && result.show === 'reviewjob') {
        this.modalcontend = result;
        this.openreview = result.content;
        this.elementRef.nativeElement.querySelector('#openModalreviewjob').click();
      } else if (result && result.show === 'categoryadd') {
        this.manicategory = false;
        this.subcategory = false;
        this.editcategory_profile = result.content.profiledetails;
        this.editcategoryform = null;
        this.modalcontend = result;
        this.elementRef.nativeElement.querySelector('#openModalcategoryadd').click();
      } else if (result && result.show === 'categoryedit') {
        this.modalcontend = result;
        this.manicategory = true;
        this.subcategory = true;
        this.editcategoryform = result.content.item;
        this.editcategory_profile = result.content.profiledetails;
        this.commision = '';
        this.getsubcategory(result.content.item.categoryid);
        this.Categoryinfoform = JSON.parse(localStorage.getItem('updateCategoryinfo'));
        this.elementRef.nativeElement.querySelector('#openModalcategoryadd').click();
      } else if (result && result.show === 'document') {
        this.filename = 'No File Chosen';
        this.modalcontend = result;
        this.editimage = result.content;
        this.Getdocumentlist = result.doclist;
        this.profiledata = result.profileid;
        this.elementRef.nativeElement.querySelector('#openModaldocument').click();
      } else if (result === '' || typeof result.show == "undefined") {
        this.elementRef.nativeElement.querySelector('#walletclose').click();
        this.elementRef.nativeElement.querySelector('#canceljobclose').click();
        this.elementRef.nativeElement.querySelector('#completedjobclose').click();
        this.elementRef.nativeElement.querySelector('#reviewjobclose').click();
        this.elementRef.nativeElement.querySelector('#categoryaddclose').click();
        this.elementRef.nativeElement.querySelector('#documentclose').click();
        this.submitted = false;
        // card reset form values
        this.savebtn = 0;
        this.carddetailsform.controls['number'].setValue('');
        this.carddetailsform.controls['exp_month'].setValue('');
        this.carddetailsform.controls['exp_year'].setValue('');
        this.carddetailsform.controls['cvv'].setValue('');

        this.categoryedittaskerForm.controls['manicategory'].setValue('');
        this.categoryedittaskerForm.controls['subcategory'].setValue('');
        this.categoryedittaskerForm.controls['rate'].setValue('');
        this.categoryedittaskerForm.controls['explevel'].setValue('');

        this.categorytaskerForm.controls['manicategory'].setValue('');
        this.categorytaskerForm.controls['subcategory'].setValue('');
        this.categorytaskerForm.controls['rate'].setValue('');
        this.categorytaskerForm.controls['explevel'].setValue('');

        this.myForm.reset();
        this.store.documentaddedit.next('');
        // this.fileData = <File><empty>
      }
    })
    let user = JSON.parse(localStorage.getItem('currentuser'));
    if (user.user_type == 'user') {
      this.type = 'tasker'
    } else {
      this.type = 'user'
    }
  }
  checklength(number) {
    if (number.target.value.length === 16) {
      this.cardnumber_Error = '';
    } else if (number.target.value.length === 0) {
      this.cardnumber_Error = '';
    } else {
      this.cardnumber_Error = 'Please Check Card Number';
    }
  }
  AmexCardnumber(inputtxt) {
    var cardno = /^(?:3[47][0-9]{13})$/;
    return cardno.test(inputtxt);
  }
  VisaCardnumber(inputtxt) {
    var cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    return cardno.test(inputtxt);
  }
  MasterCardnumber(inputtxt) {
    var cardno = /^(?:5[1-5][0-9]{14})$/;
    return cardno.test(inputtxt);
  }
  DiscoverCardnumber(inputtxt) {
    var cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    return cardno.test(inputtxt);
  }
  DinerClubCardnumber(inputtxt) {
    var cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
    return cardno.test(inputtxt);
  }
  JCBCardnumber(inputtxt) {
    var cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
    return cardno.test(inputtxt);
  }
  IsValidCreditCardNumber(cardNumber) {
    var cardType = null;
    if (this.VisaCardnumber(cardNumber)) {
      cardType = "visa";
    } else if (this.MasterCardnumber(cardNumber)) {
      cardType = "mastercard";
    } else if (this.AmexCardnumber(cardNumber)) {
      cardType = "americanexpress";
    } else if (this.DiscoverCardnumber(cardNumber)) {
      cardType = "discover";
    } else if (this.DinerClubCardnumber(cardNumber)) {
      cardType = "dinerclub";
    } else if (this.JCBCardnumber(cardNumber)) {
      cardType = "jcb";
    }
    return cardType;
  }
  get cardformvalidation() { return this.carddetailsform.controls };
  onSubmitwallet() {
    this.submitted = true;
    if (this.carddetailsform.invalid || this.cardnumber_Error != '') {
      return;
    }
    let date = new Date();
    let expiryDate = new Date(this.carddetailsform.value.exp_year, parseInt(this.carddetailsform.value.exp_month), -1);
    if (expiryDate >= date) {
      this.savebtn = 1;
      // this.store.walletadddata.next(this.carddetailsform.value);
      this.modalcontend.siFn(this.carddetailsform.value);
    } else {
      this.errorsmsg("Expiry month should not be lesser than current month")
    }
  }
  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  materialClear() {
    if(this.checkbox){
      this.checkbox.nativeElement.checked = false;
    }
    this.myForm.reset();
    this.modalcontend.siFn();
    this.additemamount = 0;
    this.additem = 0;
    this.clearFormArray(this.arrayControl);
  }
  confirmed() {
    let data = {
      reasons: this.reasons,
      otherdata: this.otherdata
    }
    // this.store.Canceljob.next(data);
    this.modalcontend.siFn(data);
  }
  addInput(): void {
    const arrayControl = <FormArray>this.myForm.controls['formArray'];
    let newGroup = this.formBuilder.group({
      name: [''],
      price: ['']
    });
    arrayControl.push(newGroup);
    this.additem = arrayControl.value.length;
  }
  delInput(index: number): void {
    const arrayControl = <FormArray>this.myForm.controls['formArray'];
    arrayControl.removeAt(index);
    this.additemamount = this.myForm.value.formArray.reduce((index, item) => {
      return index + item.price;
    }, 0);
    this.additem = arrayControl.value.length;
  }
  amountchange(event) {
    this.additemamount = this.myForm.value.formArray.reduce((index, item) => {
      return index + item.price;
    }, 0);
  }
  completeformsubmit() {
    let data = {
      newdata: this.myForm.value.formArray,
    }
    // this.store.completedjob.next(data);
    this.modalcontend.siFn(data);
  }
  ratedata(val) {
    this.rate = val;
  }
  submitreview() {
    this.submited = true;
    if(this.rate && this.comment){
      let data = {
        rating: this.rate,
        comments: this.comment,
      }
      this.rate = 0;
      this.comment = '';
      this.modalcontend.siFn(data);
      // localStorage.setItem('reviewjob', JSON.stringify(data));
    }
  }

  Categorychange(event) {
    if (event.target.value != '') {
      this.getsubcategory(event.target.value);
    }
  }
  getsubcategory(id) {
    this.manicategory = true;
    let selectcategory = this.Categorylist.filter(x => x._id == id);    
    const data = {
      slug: selectcategory[0].slug
    };
    this.ApiService.Getsubcategory(data).subscribe(result => {
      if (result.status === 1) {
        this.Subcategorylist = result.response;
      }
    });
  }
  subcategorycommision(event) {
    this.subcategory = true;
    let data = this.Subcategorylist.filter(x => x._id == event.target.value);
    this.categoryType = data[0].ratetype;
    this.commisionrate = data[0].commision;
    this.categoryedittaskerForm.controls['rate'].setValue(this.commisionrate);
    this.categorytaskerForm.controls['rate'].setValue(this.commisionrate);
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
    if (this.categorytaskerForm.invalid || this.commision != '') {
      return;
    }
    let priviousvalue = this.editcategory_profile;
    let data = [];
    let addnewcat = this.categorytaskerForm.value;
    addnewcat.status = 1;
    data.push(addnewcat);
    if (priviousvalue) {
      for (let i = 0; i < priviousvalue.length; i++) {
        data.push(priviousvalue[i]);
      }
    }
    // console.log(data,priviousvalue);return 
    // localStorage.setItem('updateCategoryinfo', JSON.stringify(data));
    this.categorysubmitted = false;
    // this.store.selectedcategory.next(JSON.parse(localStorage.getItem('updateCategoryinfo')));
    this.manicategory = false;
    this.subcategory = false;
    this.modalcontend.siFn(data);
    localStorage.removeItem('updateCategoryinfo');
  }

  checkcommisionedit(event, subcat_id) {
    let subcategoryid = this.Subcategorylist.filter(x => x._id == subcat_id);
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
    if (this.categoryedittaskerForm.invalid || this.commision != '') {
      return;
    }
    let data = [] as any;
    let addcatform = this.categoryedittaskerForm.value;
    addcatform.status = 1;
    let categoryid = this.categoryedittaskerForm.value.manicategory;
    let priviousvalue = this.editcategory_profile;
    for (let i = 0; i < priviousvalue.length; i++) {
      if (priviousvalue[i].categoryid == categoryid) {
        data.push(addcatform);
      } else {
        data.push(priviousvalue[i]);
      }
    }
    // this.store.selectedcategory.next(data);
    this.modalcontend.siFn(data);
  }

  imagechangefun(event) {
    if (event && event.target.files) {
      const imgbytes = event.target.files[0].size;
      const imgtype = event.target.files[0].type;
      this.filename = event.target.files[0].name;

      if (this.Getdocumentlist.doccond == 1) {
        let selected_doc = this.Getdocumentlist.response.filter(x => x.replace_name == this.editimage.name || x.name == this.editimage.name);
        var imagetype = [];
        var imagename = [];
        if (selected_doc[0].file_types) {
          for (var i = 0; i < selected_doc[0].file_types.length; i++) {
            imagetype.push(selected_doc[0].file_types[i].ftype);
            imagename.push(selected_doc[0].file_types[i].name);
          }
          const validImageTypes = imagetype;
          if (validImageTypes.includes(imgtype)) {
            if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
              this.imagevalidation = 'red';
            } else {
              this.imagevalidation = 'black';
              this.fileData = <File>event.target.files[0];
              this.preview();
            }
          } else {
            this.imagevalidation = 'red';
          }
        } else {
          this.imagevalidation = 'black';
          this.fileData = <File>event.target.files[0];
          this.preview();
        }
      } else {
        if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
          this.imagevalidation = 'red';
        } else {
          this.imagevalidation = 'black';
          this.fileData = <File>event.target.files[0];
          this.preview();
        }
      }
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
  closeModal() {
    this.previewUrl = '';
    this.modalcontend.noFn();
  }

  downloadPdf(task_id, type) {
    if (type == 'user') {
      this.service.userdownloadPdf({ task_id: task_id, type: type }).subscribe(data => {
       if(data.status == 1){
      //  window.location.href = this.imageUrl+data.path;
      var a = document.createElement("a");
          a.href = this.imageUrl+data.path;
          a.download = 'invoice.pdf';
          // start download
          a.click();
          
       }
      })
    } else {
      this.service.downloadPdf({ task_id: task_id, type: type }).subscribe(data => {
        if(data.status == 1){
          // window.location.href = this.imageUrl+data.path;
          var a = document.createElement("a");
          a.href = this.imageUrl+data.path ;
          a.download = 'invoice.pdf';
          // start download
          a.click()
         }
      })
    }
    // const data = document.getElementById('pdfData');
    // console.log(this.pdfData);
    // html2canvas(data).then(canvas => {
    //   const imgWidth = 208;
    //   const pageHeight = 120;
    //   const imgHeight = canvas.height * imgWidth / canvas.width;
    //   const heightLeft = imgHeight;
    //   const contentDataURL = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF();
    //   pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight,);
    //   pdf.save('invoice.pdf');
    // });
    // public downloadPdf() {
    //   var data = document.getElementById('pdfData');
    //   html2canvas(data).then(canvas => {
    //     // Few necessary setting options  
    //     // var imgWidth = 208;
    //     // var pageHeight = 1500;
    //    var imgHeight = canvas.height;
    //     // var heightLeft = imgHeight;

    //     var contentDataURL = canvas.toDataURL('image/png')
    //     // 
    //     const pdf = new jsPDF();  
    //     console.log(canvas);

    //     pdf.addImage(contentDataURL, 'PNG', 0, 0, 208, imgHeight)
    //     pdf.save('invoice.pdf'); // Generated PDF   
    //   });
  }
  onSubmit() {
    let selected_doc = this.Getdocumentlist.response.filter(x => x.replace_name == this.editimage.name || x.name == this.editimage.name);
    if (!this.fileData) {
      if (selected_doc[0].mandatory === 1) {
        this.submited = true;
      } else {
        this.elementRef.nativeElement.querySelector('#documentclose').click();
      }
      return;
    }
    this.submited = false;
    this.savebtn = 1;
    let data = {
      _id: this.profiledata,
      doc_id: selected_doc[0]._id,
      name: this.editimage.name
    } as any;
    var formData = new FormData();
    formData.append('file', this.fileData);
    formData.append('info', JSON.stringify(data));
    let response = {
      editimage: this.editimage,
      formData: formData,
    };
    this.store.documentaddedit.next(response);
    this.modalcontend.siFn();
    this.fileData = null;
    this.filename = 'No File Chosen';
    this.previewUrl = '';
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
