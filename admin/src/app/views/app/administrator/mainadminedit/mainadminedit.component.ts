import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { AdminService } from "src/app/_services/admin.service";


@Component({
  selector: 'app-mainadminedit',
  templateUrl: './mainadminedit.component.html',
  styleUrls: ['./mainadminedit.component.scss']
})
export class MainadmineditComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.AdminService.CommonApi('post', 'admins/edit', {}).subscribe(
      (data)=>{
        console.log(data);        
    })
  }
}
