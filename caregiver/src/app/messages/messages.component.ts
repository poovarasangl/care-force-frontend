import { Component, OnInit } from '@angular/core';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { MessagesService } from './messages.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass']
})
export class MessagesComponent implements OnInit {
  currentuser: any;
  messagecount: number = 0;
  messages: any;
  skip: number = 0;
  limit: number = 3;
  currentpage: number = 0;

  constructor(private sweetalert: ConfirmDialogService,
    private ApiService: MessagesService,
    private router: Router,
    private toastr: AlertService,
    private spinner: SpinnerService, ) {
    this.currentuser = JSON.parse(localStorage.getItem('currenttasker'));
  }

  ngOnInit() {
    let data = {
      userId: this.currentuser.user_id,
      currentusertype: this.currentuser.user_type,
      skip: this.skip,
      limit: this.limit,
    }
    this.ApiService.getmessage(data).subscribe((result: any) => {
      this.hidespinner();
      if (result.status === 1) {
        this.messagecount = result.response.count.length;
        this.messages = result.response.messages;        
      }
    })
  }
  view(item) {
    let data = {
      user_id: item.user[0]._id,
      tasker_id: item.tasker[0]._id,
      task_id: item.task._id,
      user_type: this.currentuser.user_type
    }
    localStorage.setItem('chat', JSON.stringify(data));
    this.router.navigate(['/chat']);
  }
  deletemsg(item) {
    this.sweetalert.confirmThis("Are You Sure You Want To Delete This Conversation?", () => {
      this.deletefunction(item)
    }, () => {
      //alert("No clicked");
    });
  }
  deletefunction(item) {
    let data = {
      chatinfo: {
        taskid: item.task._id,
        userid: item.user[0]._id,
        taskerid: item.tasker[0]._id
      },
      usertype: this.currentuser.user_type
    }
    this.ApiService.deleteConversation(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.ngOnInit();
        this.successmsg('Succesfully deleted!.');
        this.hidespinner();
      } else {
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    });
  }
  pagechange(event) {
    this.currentpage = event;
    let data = {
      userId: this.currentuser.user_id,
      currentusertype: this.currentuser.user_type,
      skip: this.limit * (this.currentpage - 1),
      limit: this.limit * this.currentpage
    }
    this.ApiService.getmessage(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.messagecount = result.response.count.length;
        this.messages = result.response.messages;
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
  showspinner() {
    this.spinner.Spinner('show');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}
