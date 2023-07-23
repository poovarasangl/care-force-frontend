import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-replymail-modal',
  templateUrl: './replymail-modal.component.html',
  styleUrls: ['./replymail-modal.component.scss']
})
export class ReplymailModalComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  @Output() replymail: EventEmitter<any> = new EventEmitter();
  modalRef: BsModalRef;
  @Input() templateData : any;

  constructor(private notifications: NotificationsService,private modalService: BsModalService,) { }
  
  ngOnChanges() {    
    console.log(this.templateData);
  }

  ngOnInit(): void {
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  onSubmit() {
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    if (this.form.valid) {
      this.replymail.emit(this.form.form.value)
    }else{
      this.buttonDisabled = false;
      this.buttonState = '';
      this.notifications.create('Error', 'Please Enter all mandatory fields', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }
}
