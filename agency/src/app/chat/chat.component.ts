import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { SpinnerService } from '../spinner/spinner.service';
import { AlertService } from '../alert/alert.service';
import { CONFIG } from '../config';
import { SocketService } from '../socket.service';
import { StoreService } from "../store/store.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {
  attachment: boolean = false;
  currentuser: any;
  chatrequest: any;
  taskdetails: any;
  messages = [];
  imageUrl = CONFIG.imageUrl;
  user: boolean = false; //chat design use this right or left
  message: any; //Type message contend
  attachment_file: any  //Type file contend
  typing: boolean;
  constructor(private ApiService: ChatService,
    private toastr: AlertService,
    private spinner: SpinnerService,
    private store: StoreService,
    private socket: SocketService,
    private cd: ChangeDetectorRef) {
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.chatrequest = JSON.parse(localStorage.getItem('chat'));
  }

  ngOnInit() {
    if (this.chatrequest && this.currentuser) {
      let data = {
        user: this.chatrequest.user_id,
        tasker: this.chatrequest.tasker_id,
        task: this.chatrequest.task_id,
        type: this.currentuser.user_type
      }
      this.ApiService.getchathistory(data).subscribe((result: any) => {
        if (result.status === 1) {
          if (result && result.response.taskdata) {
            this.taskdetails = result.response.taskdata;
            this.messages = result.response.messages.messages;

            var message_status_data = {} as any;
            message_status_data.task = this.taskdetails._id;
            message_status_data.user = this.taskdetails.user.user_id;
            message_status_data.tasker = this.taskdetails.tasker.tasker_id;
            message_status_data.type = this.currentuser.user_type;

            this.socket.emit('message status', message_status_data);

          } else {
            this.taskdetails = result.response;
          }
          this.cd.detectChanges();
        }
      });
    }

    this.store.SocketListen.subscribe((data: any) => {
      if (typeof data != 'undefined' && data != '') {
        if (data.type == 'start_typing') {
          this.typing = true;
        } else if (data.type == 'webupdatechat') {
          var newdata = data.data;
          if (this.taskdetails._id == newdata.taskdata._id && this.taskdetails.tasker.tasker_id == newdata.tasker && this.taskdetails.user.user_id == newdata.user) {
            this.messages.push(newdata.messages[0]);
            if (newdata.messages[0].from != this.currentuser.user_id) {
              newdata.currentuserid = this.currentuser.user_id;
              newdata.usertype = this.currentuser.user_type;
              this.socket.emit('single message status', newdata);
            }
          }
          // let val ={type:'alert',data : data.data}
          // this.store.SocketListen.next(val);
        } else if (data.type == 'stop_typing') {
          this.typing = false;
        } else if (data.type == 'message_status') {
          this.messages = data.data.messages;
        } else if (data.type == 'single_message_status') {
          for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i]._id == data.data.messages[0]._id) {
              var usertype = this.currentuser.user_type;
              if (usertype == 'user') {
                this.messages[i].tasker_status = 2;
                this.messages[i].user_status = 2;
              } else if (usertype == 'tasker') {
                this.messages[i].tasker_status = 2;
                this.messages[i].user_status = 2;
              }
            }
          }
        }
        // this.cd.detectChanges();
      }
    })
  }

  send(msg) {
    if (msg) {
      if (this.currentuser.user_type == 'tasker') {
        var data = { 'user': this.taskdetails.user.user_id, 'tasker': this.taskdetails.tasker.tasker_id, 'message': msg, 'task': this.taskdetails._id, 'from': this.currentuser.user_id, datatype: 'text' };
      } else if (this.currentuser.user_type == 'user') {
        var data = { 'user': this.taskdetails.user.user_id, 'tasker': this.taskdetails.tasker.tasker_id, 'message': msg, 'task': this.taskdetails._id, 'from': this.currentuser.user_id, datatype: 'text' };
      }
      this.message = '';
      this.socket.emit('newmessage', data);
    } else if (this.attachment_file) {
      var msgdata = {} as any;
      if (this.currentuser.user_type == 'tasker') {
        msgdata = {
          'user': this.taskdetails.user.user_id, 'tasker': this.taskdetails.tasker.tasker_id, name: this.attachment_file.name,
          'message': this.attachment_file, 'task': this.taskdetails._id, 'from': this.currentuser.user_id, datatype: `${this.attachment_file.extension}`
        };
      } else if (this.currentuser.user_type == 'user') {
        msgdata = {
          'user': this.taskdetails.user.user_id, 'tasker': this.taskdetails.tasker.tasker_id, name: this.attachment_file.name,
          'message': this.attachment_file, 'task': this.taskdetails._id, 'from': this.currentuser.user_id, datatype: `${this.attachment_file.extension}`
        };
      }
      this.socket.emit('sharefile', msgdata);
    }
  }
  filechange(event) {
    if (event.target.files) {
      var uploadName = event.target.files[0].type.split('/');
      var extension = uploadName[0];
      this.attachment_file = event.target.files[0];
      this.attachment_file.extension = extension;
      this.send('');
    }
  }
  typingStatus() {
    var data = {} as any;
    if (this.currentuser.user_type == 'tasker') {
      data.to = this.taskdetails.user.user_id;
      data.from = this.taskdetails.tasker.tasker_id;
    } else if (this.currentuser.user_type == 'user') {
      data.from = this.taskdetails.user.user_id;
      data.to = this.taskdetails.tasker.tasker_id;
    }
    data.task = this.taskdetails._id;
    data.user = this.taskdetails.user.user_id;
    data.tasker = this.taskdetails.tasker.tasker_id;
    data.type = this.currentuser.user_type;

    this.socket.emit('start typing', data);
    let lastTypingTime = (new Date()).getTime();

    setTimeout(() => {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= 400) {
        this.socket.emit('stop typing', data);
      }
    }, 2000);

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
