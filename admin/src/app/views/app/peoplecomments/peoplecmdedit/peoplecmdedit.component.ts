import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AdminService, Apiconfig } from 'src/app/_services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-peoplecmdedit',
  templateUrl: './peoplecmdedit.component.html',
  styleUrls: ['./peoplecmdedit.component.scss']
})
export class PeoplecmdeditComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  title = '';
  buttonDisabled = false;
  buttonState = '';
  peoCmtData = new FormData();
  imageUrl: string = environment.apiUrl;
  imagepreview = {
    image: '' as string | ArrayBuffer,
    icon: '' as string | ArrayBuffer,
    activeicon: '' as string | ArrayBuffer
  }
  peopleCommentData: any;
  editid: string;
  spinner = 'none';

  constructor(private apiService: AdminService, private router: Router,
    private ActivatedRoute: ActivatedRoute, private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.showspinner();
    this.editid = this.ActivatedRoute.snapshot.paramMap.get('id');
    if (this.editid) {
      this.hidespinner();
      this.title = 'Edit';
      this.apiService.CommonApi('post', Apiconfig.peopleCmdEdit, { id: this.editid }).subscribe(result => {
        if (result.status == 1) {
          this.peopleCommentData = result.response;
          console.log(this.peopleCommentData);
          this.form.form.controls['peopleName'].setValue(this.peopleCommentData.name);
          this.form.form.controls['professionName'].setValue(this.peopleCommentData.profession);
          this.form.form.controls['description'].setValue(this.peopleCommentData.description);
          this.form.form.controls['status'].setValue(this.peopleCommentData.status+'');
          this.form.form.controls['image'].setValue(this.peopleCommentData.image);
        }
      });
    } else {
      this.hidespinner();
      this.title = 'Add';
    }
  }

  getFiles(event, key) {
    const imgbytes = event.target.files[0].size;
    const imgtype = event.target.files[0].type;
    this.peoCmtData.delete(key);
    if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
      if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
        this.notifications.create('Error', 'The uploaded image size must be maximum of 1 MB', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        this.form.form.controls['image'].setValue('');
        return false;
      } else {
        this.peoCmtData.append(key, event.target.files[0], event.target.files[0]['name']);
        this.preview(event.target.files[0], key);
      }
    } else {
      this.notifications.create('Error', 'Unsupported File Format', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      this.form.form.controls['image'].setValue('');
      return false;
    }
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

  onSubmit() {
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    if (this.form.form.valid) {
      this.buttonState = 'show-spinner';
      let Data = this.form.form.value;
      Data.name = this.form.form.get('peopleName').value;
      Data.profession = this.form.form.get('professionName').value;
      Data.description = this.form.form.get('description').value;
      Data.status = this.form.form.get('status').value;
      Data.image = this.form.form.get('image').value;
      Data._id = this.editid;
      delete Data.image;

      this.peoCmtData.append('info', JSON.stringify(Data));
      this.apiService.CommonApi('post', Apiconfig.peopleCmdSave, this.peoCmtData).subscribe(result => {
        if (result.status == 1) {
          this.hidespinner();
          this.notifications.create('Success', 'People comment Added Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
          setTimeout(() => {
            this.buttonDisabled = false;
            this.notifications.create('Success', 'People comment Added Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
            this.router.navigate(['app/peoplecomments/list']);
          }, 1000);
        }
      });
    } else {
      this.hidespinner();
      this.buttonState = '';
      this.notifications.create('Error', 'Please enter all the madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
