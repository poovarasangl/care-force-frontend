import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig, AdminService } from "../../../../_services";
import { FormGroup, FormControl,NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.scss']
})
export class AddpageComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  pageUrl: string = environment.apiUrl;
  spinner = 'none';
  modulesBubble = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' }
      ],
      ['link'],
      ['clean']
    ]
  };
  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) {
    
   }
 categorytitle = [];
 title ="";
 slugurl: string;
 slugchange:boolean = false;

  ngOnInit() {

    this.AdminService.CommonApi('get', Apiconfig.PageSettings, {}).subscribe(
      (data) => {
        if(data){
          if(data.response.settings){
            this.categorytitle = data.response.settings;
          }
        }
      }, (error) => {
        console.log(error);
      })
      
        const id = this.ActivatedRoute.snapshot.paramMap.get('id');
        if(id){
          this.showspinner();
          this.title = "Edit";
          this.AdminService.CommonApi('post', Apiconfig.PageEdit, {id:id}).subscribe(
            (result) => {
              this.hidespinner();
              if(result){
                this.slugurl = result.response[0].slug;
                this.form.form.controls['page_id'].setValue(result.response[0]._id);
                this.form.form.controls['name'].setValue(result.response[0].name);
                this.form.form.controls['description'].setValue(result.response[0].description);
                this.form.form.controls['footer_title'].setValue(result.response[0].category);
                this.form.form.controls['publish'].setValue(result.response[0].status+'');
                this.form.form.controls['pageTitle'].setValue(result.response[0].seo.title);
                this.form.form.controls['focusKeyword'].setValue(result.response[0].seo.keyword);
                this.form.form.controls['seo_description'].setValue(result.response[0].seo.description);
                this.form.form.controls['slug'].setValue(result.response[0].slug);
              }
            }, (error) => {
              this.hidespinner();
              console.log(error);
            })
        }else{
          this.hidespinner();
          this.title = "Add New";
        }
      
  }

  slugdata(event){
    setTimeout(() => {
      var slugdata = event.split(' ').join('-');
      this.slugurl = slugdata;
    }, 500);
  }

  slugedit(){
    setTimeout(() => {
      this.slugchange = true;
      this.form.form.controls['slug'].setValue(this.slugurl);
    }, 500);
  }
  slugchanges(event){
    this.slugurl = event;
  }

  onSubmit() {
    this.showspinner();  
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    if (this.form.form.valid) {
      var data = {
        '_id':this.form.form.get('page_id').value,
        'name':this.form.form.get('name').value,
        'slug':this.form.form.get('slug').value,
        'description':this.form.form.get('description').value,
        'category':this.form.form.get('footer_title').value,
        'status':this.form.form.get('publish').value
      };
      data['seo'] ={
        'title':this.form.form.get('pageTitle').value,
        'keyword':this.form.form.get('focusKeyword').value,
        'description':this.form.form.get('seo_description').value

      };
      var formdata = {};
       formdata['data'] = data;
      this.AdminService.CommonApi('post', Apiconfig.PageSubmit, formdata).subscribe(
        (data) => {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
          if(data){
            if(data.status == 1 ){
              this.hidespinner();
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Success', data.response, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });

              setTimeout(() => {
                this.router.navigate(['/app/site-page/allpages']);
              }, 1000);
            }else{
              this.hidespinner();
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            }
          }
        }, (error) => {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        })
    }
    else {
      this.hidespinner();
      this.buttonDisabled = false;
      this.buttonState = '';
      this.notifications.create('Error', 'Please Enter all mandatory fields', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
