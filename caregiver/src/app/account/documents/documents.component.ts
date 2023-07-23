import { Component, ElementRef, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { AccountComponent } from '../account.component';
import { CONFIG } from '../../config';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { AlertService } from '../../alert/alert.service';
import { SpinnerService } from '../../spinner/spinner.service';
import { ModalService } from '../../modal/modal.service';
import { StoreService } from '../../store/store.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.sass']
})
export class DocumentsComponent implements OnInit {
  profiledata: any;
  imageurl = CONFIG.imageUrl;
  imagevalidation = 'black';
  fileData: File;
  previewUrl: string | ArrayBuffer;
  previewUrl1: string | ArrayBuffer;
  filename = 'No File Chosen';
  filename1 = 'No File Chosen';
  editimage: any;
  Getdocumentdetails: any;
  toastmsg: String = '';
  submited: boolean = false;
  Getdocumentlist: any;
  savebtn = 0;
	documentdata = new FormData();

  constructor(private ApiService: AccountService,
    private elementRef: ElementRef,
    private homepage: AccountComponent,
    private toastr: AlertService,
    private sweetalert: ConfirmDialogService,
    private spinner: SpinnerService,
    private modalservice: ModalService,
    private store: StoreService
  ) { }

  ngOnInit() {
    this.documentdata = new FormData();
    this.filename = 'No File Chosen';
    localStorage.setItem('showtab', 'Documentstab');
    this.ApiService.Profiledetails.subscribe(result => {
      this.profiledata = result;
    });
    this.ApiService.Getdocumentdetails().subscribe(result => {
      this.hidespinner();
      if (result.doccond == 0) {
        this.Getdocumentdetails = '';
      } else {
        this.Getdocumentdetails = result.response;
        this.Getdocumentlist = result;
      }
    });
  }
  getimage(path) {
    if (path != '' && path != undefined && path != null) {
      return `${this.imageurl}${path}`;
    } else {
      return 'assets/images/Default/no_image-128.png';
    }
  }

  openModal(item, template, add_or_edit) {
    this.editimage = this.profiledata.doc.filter(x => x.name === item.replace_name)[0] ? this.profiledata.doc.filter(x => x.name === item.replace_name)[0] : this.Getdocumentdetails.filter(x => x.replace_name === item.replace_name)[0];
    this.editimage.add_or_edit = add_or_edit;
    this.elementRef.nativeElement.querySelector('#openModaldocument').click();
    // this.modalservice.document('Add/Edit Document','document',this.editimage,this.Getdocumentlist,this.profiledata._id,()=>{
    //   if(count == 0){
    //     count ++;       
    //     this.store.documentaddedit.subscribe((result:any)=>{
    //       if(result){
    //         this.showspinner();
    //         this.modalservice.updatemessage();
    //         this.store.documentaddedit.next('');
    //         this.documentupload(result);
    //       }
    //     });
    //   }else{
    //     this.modalservice.updatemessage();
    //     this.store.documentaddedit.next('');
    //   }
    // },()=>{

    // })
  }

  documentupload(result) {
    let docData = result.formData;
    this.editimage = result.editimage
    if (this.editimage.add_or_edit == 'Add') {
      this.ApiService.adddocument(docData).subscribe(respo => {
        this.hidespinner();
        if (respo.status == 1) {
          this.ngOnInit();
          this.successmsg('Add successfully!');
          this.elementRef.nativeElement.querySelector('#documentclose').click();
          this.profiledata = '';
          this.savebtn = 0;
          this.homepage.ngOnInit();
        } else {
          this.errorsmsg(respo.response);
        }
      })
    } else {
      this.ApiService.updatedocument(docData).subscribe(respo => {
        this.hidespinner();
        if (respo.status == 1) {
          this.ngOnInit();
          this.successmsg('Update successfully!');
          this.profiledata = '';
          this.savebtn = 0;
          this.homepage.ngOnInit();
          this.elementRef.nativeElement.querySelector('#documentclose').click();
        } else {
          this.errorsmsg(respo.response);
        }
      })
    }
  }

  deletedoc(id, name) {
    this.sweetalert.confirmThis("Are you sure to delete this Document?", () => {
      this.deletedfun(id, name);
    }, () => {
      //alert("No clicked");  
    });
  }

  deletedfun(id, name) {
    this.showspinner();
    let selected_doc = this.Getdocumentlist.response.filter(x => x._id == id || x.name == name);

    let data = {
      tasker: this.profiledata._id,
      doc_id: selected_doc[0]._id,
      doc_name: selected_doc[0].name
    } as any;
    this.ApiService.updatetaskerprofile(data).subscribe(result => {
      this.hidespinner();
      if (result.status == 1) {
        this.ngOnInit();
        this.successmsg('Update successfully!');
        this.homepage.ngOnInit();
      } else {
        this.errorsmsg(result.response);
      }
    });
  }

  imagechangefun(event, type) {
    if (event && event.target.files) {
      const imgbytes = event.target.files[0].size;
      const imgtype = event.target.files[0].type;
      this.documentdata.delete(type);
      if(type == 'front'){
        this.filename = event.target.files[0].name;
      }else{
        this.filename1 = event.target.files[0].name;
      }

      if (this.Getdocumentlist.doccond == 1) {
        let selected_doc = this.Getdocumentlist.response.filter(x => x.replace_name == this.editimage.replace_name || x.name == this.editimage.name);
        var imagetype = [];
        var imagename = [];
        if (selected_doc[0].file_types) {
          for (var i = 0; i < selected_doc[0].file_types.length; i++) {
            imagetype.push(selected_doc[0].file_types[i].ftype);
            imagename.push(selected_doc[0].file_types[i].name);
          }
          const validImageTypes = imagetype;
          if (validImageTypes.includes(imgtype)) {
            if (Math.round(parseInt(imgbytes) / 3072) > 3072){
              this.imagevalidation = 'red';
              this.errorsmsg('Allowed file size should be lesser than 3 MB');
            } else {
              this.imagevalidation = 'black';
              this.fileData = <File>event.target.files[0];
              this.documentdata.append(type, event.target.files[0], event.target.files[0]['name']);
              this.preview(type);
            }
          } else {
            this.imagevalidation = 'red';
          }
        } else {
          this.imagevalidation = 'black';
          this.fileData = <File>event.target.files[0];
          this.documentdata.append(type, event.target.files[0], event.target.files[0]['name']);
          this.preview(type);
        }
      } else {
        if (Math.round(parseInt(imgbytes) / 3072) > 3072){
          this.imagevalidation = 'red';
        } else {
          this.imagevalidation = 'black';
          this.fileData = <File>event.target.files[0];
          this.documentdata.append(type, event.target.files[0], event.target.files[0]['name']);
          this.preview(type);
        }
      }
    }
  }

  preview(type) {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    if(type == 'front'){
      reader.onload = (_event) => {
        this.previewUrl = reader.result;
      }
    }else{
      reader.onload = (_event) => {
        this.previewUrl1 = reader.result;
      }
    }
  }
  closeModal() {
    this.previewUrl = '';
  }

  onSubmit() {
    let selected_doc = this.Getdocumentlist.response.filter(x => x.replace_name == this.editimage.replace_name || x.replace_name_back == this.editimage.replace_name);

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
      tasker: this.profiledata._id,
      doc_id: selected_doc[0]._id,
      doc_name: this.editimage.name,
    doc_replace_name : selected_doc[0].replace_name,
		replace_name_back : selected_doc[0].replace_name_back,
		//stripe : selected_doc[0].stripe
    } as any;
    
    this.documentdata.append('info', JSON.stringify(data));
    let response = {
      editimage: this.editimage,
      formData: this.documentdata,
    };
    this.fileData = null;
    this.documentupload(response);
    this.filename = 'No File Chosen';
    this.previewUrl = '';
    this.filename1 = 'No File Chosen';
    this.previewUrl1 = '';
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
  showspinner() {
    this.spinner.Spinner('show');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}
