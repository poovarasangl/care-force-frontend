import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { StoreService } from '../../store/store.service';
import { AccountComponent } from '../account.component';
import { AlertService } from '../../alert/alert.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/spinner/spinner.service';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit {
  profiledata: any;
  maincategorylist: any;
  categorysubmitted = false;
  Categorylist: any;
  manicategory = false;
  subcategory: any;
  currentuser: any;
  tasker_id:any;

  constructor(private ApiService: AccountService,
    private store: StoreService,
    private homepage: AccountComponent,
    private toastr: AlertService,
    private sweetalert: ConfirmDialogService,
    private spinner: SpinnerService,
    private modalservice: ModalService) {
    this.store.category.subscribe(result => {
      this.Categorylist = result;
    });
    this.currentuser = JSON.parse(localStorage.getItem('currenttasker'));
    this.tasker_id = this.currentuser.user_id;
  }

  ngOnInit() {
    localStorage.setItem('showtab', 'Categorytab');
    this.ApiService.Profiledetails.subscribe(result => {
      this.hidespinner();
      this.profiledata = result;
    });
  }
  getcategoryname(categoryid) {
    let data = this.Categorylist.filter(x => x._id == categoryid);
    if (data.length > 0) {
      return data[0].name;
    }
  }
  showModal(): void {
    let data = {profiledetails : this.profiledata.taskerskills};
    this.modalservice.categoryadd('Add Category', 'categoryadd',data, (responce) => {
      // this.store.selectedcategory.subscribe((responce: any) => {
        // console.log(responce);return        
        if(responce){
          this.addcategory(responce);
        }
      // });
    }, () => {
    });
  }
  addcategory(result) {
    if (result.length > 0) {
      let Categoryinfo: any;
      Categoryinfo = result;
      // console.log("Categoryinfo +++++++++++++++++++++++", Categoryinfo)
      const categor = result[0];
      var catdata = {
        id: this.tasker_id,
        categoryid: categor.manicategory,
        // childid: categor.subcategory,
        hour_rate: categor.rate,
        experience: categor.explevel,
        status: 1
      }
      let taskerskills = [];
      for (let i = 0; i < Categoryinfo.length; i++) {
        taskerskills[i] = {
          categoryid: Categoryinfo[i].manicategory ? Categoryinfo[i].manicategory : Categoryinfo[i].categoryid,
          // childid: Categoryinfo[i].subcategory ? Categoryinfo[i].subcategory : Categoryinfo[i].childid,
          hour_rate: Categoryinfo[i].rate ? Categoryinfo[i].rate : Categoryinfo[i].hour_rate,
          experience: Categoryinfo[i].explevel ? Categoryinfo[i].explevel : Categoryinfo[i].experience,
          status: 1
        }
      }
      this.ApiService.savetaskercategory(catdata).subscribe(result => {
        this.hidespinner();
        if (result.status == 1) {
          this.homepage.ngOnInit();
          localStorage.removeItem('updateCategoryinfo');
          this.ngOnInit();
          // this.store.selectedcategory.next([]);
          this.modalservice.updatemessage();
          this.successmsg('Successfully add!!');
        } else {
          this.errorsmsg(result.response)
        }
      });
    }
  }
  deletecategory(id) {
    this.sweetalert.confirmThis("Are you sure to delete this category?", () => {
      this.deletedfun(id);
    }, () => {
      //alert("No clicked");  
    });
  }
  deletedfun(id) {
    this.showspinner();
    var category = {
      childid: id,
      id: this.tasker_id
    }
    for (let i = 0; i < this.profiledata.taskerskills.length; i++) {
      if (id == this.profiledata.taskerskills[i].categoryid) {
        this.profiledata.taskerskills.splice(i, 1);
      }
    }
    this.ApiService.deetecategory(category).subscribe(result => {
      this.hidespinner();
      if (result.status == 1) {
        this.store.selectedcategory.next([]);
        this.ngOnInit();
        this.successmsg('Successfully deleted!!');
      } else {
        this.errorsmsg(result.response)
      }
    });
  }
  editcategory(item) {
    // localStorage.setItem('updateCategoryinfo', JSON.stringify(this.profiledata.taskerskills));
    let data = {item : item,profiledetails : this.profiledata.taskerskills};
    this.modalservice.categoryedit('Edit Category', 'categoryedit', data, (responce) => {
      // this.store.selectedcategory.subscribe((responce: any) => {
        // console.log("responce +++++++++++++", responce)
        if(responce){
          this.editcategoryfun(responce);
        }
      // });
    }, () => {
    });
  }
  editcategoryfun(result) {
    if (result.length > 0) {
      let Categoryinfo: any;
      Categoryinfo = result;
      const categor = result[0];
      var catdata = {
        id: this.tasker_id,
        categoryid: categor.manicategory,
        // childid: categor.subcategory,
        hour_rate: categor.rate,
        experience: categor.explevel,
        status: 1
      }
      let taskerskills = [];
      for (let i = 0; i < Categoryinfo.length; i++) {
        taskerskills[i] = {
          categoryid: Categoryinfo[i].manicategory ? Categoryinfo[i].manicategory : Categoryinfo[i].categoryid,
          // childid: Categoryinfo[i].subcategory ? Categoryinfo[i].subcategory : Categoryinfo[i].childid,
          hour_rate: Categoryinfo[i].rate ? Categoryinfo[i].rate : Categoryinfo[i].hour_rate,
          experience: Categoryinfo[i].explevel ? Categoryinfo[i].explevel : Categoryinfo[i].experience,
          status: 1
        }
      }
      this.ApiService.savetaskercategory(catdata).subscribe(result => {
        this.hidespinner();
        if (result.status == 1) {
          localStorage.removeItem('updateCategoryinfo');
          this.ngOnInit();
          this.store.selectedcategory.next([]);
          this.modalservice.updatemessage();
          this.homepage.ngOnInit();
          this.successmsg('Successfully update!!');
        } else {
          this.errorsmsg(result.response)
        }
      });
    }
  }

  Cancel() {
    this.modalservice.updatemessage();
    localStorage.removeItem('updateCategoryinfo');
    this.store.selectedcategory.next([]);
    this.manicategory = false;
    this.subcategory = false;
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
