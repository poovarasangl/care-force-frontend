import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertService } from '../../alert/alert.service';
import { AccountService } from '../account.service';
import { CONFIG } from '../../config';
import * as moment from 'moment'
import { SpinnerService } from '../../spinner/spinner.service';
import { Router } from '@angular/router';
import { StoreService } from '../../store/store.service';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { Socket } from 'ngx-socket-io';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class JobDetailsComponent implements OnInit {
  assigned: boolean = false;
  cancelled: boolean = false;
  completed: boolean = false;
  ongoing: boolean = false;
  paymentpending: boolean = false;
  jobid: String = 'QY-';
  fromdate: any = '';
  todate: any = '';
  checkdate: any;
  task: String = 'assigned';
  bsValue: Date = new Date();
  currentuser: any = {};
  tasklist: any;
  count: number = 0;
  imageUrl = CONFIG.imageUrl;
  reasons: String = '';
  otherdata: String;
  canceldata: any;
  canceldata_values: any;
  additem: number = 0; // task complete to add item count
  additemamount: Number = 0; // task complete to add item amount
  completemodal: any;
  max = 5;
  rate = 0;
  comment: String = ''; //review comments enter feild
  reviewjob: any;
  currentpage: number = 1;
  skip: number = 0;
  limit: number = 5;
  settings: any;
  otheroptions: boolean;
  material: boolean;
  DefaultCurrency: any;
  activepagenumber: number = 1;

  constructor(private toastr: AlertService,
    private ApiService: AccountService,
    private spinner: SpinnerService,
    private router: Router,
    private store: StoreService,
    private sweetalert: ConfirmDialogService,
    private socket: Socket,
    private modalservice: ModalService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.hidespinner();
    localStorage.setItem('showtab', 'Detailstab');
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    let notificationtsearch = JSON.parse(localStorage.getItem('notificationdata'));
    let carddetails = JSON.parse(localStorage.getItem('carddetails'));
    if (this.currentuser && this.currentuser.user_id) {
      let data = {
        _id: this.currentuser.user_id,
        status: this.task,
        skip: this.skip,
        limit: this.limit,
        lang: "en",
      } as any;
      if (notificationtsearch && notificationtsearch._id) {
        this.jobid = notificationtsearch._id;
        data.booking_id = notificationtsearch._id;
        if (notificationtsearch.task[0][0].status == 1) {
          data.status = 'assigned';
          this.assigned = true;
        } else if (notificationtsearch.task[0][0].status == 2 || notificationtsearch.task[0][0].status == 3 || notificationtsearch.task[0][0].status == 4 || notificationtsearch.task[0][0].status == 5) {
          data.status = 'ongoing';
          this.ongoing = true;
        } else if (notificationtsearch.task[0][0].status == 6) {
          data.status = 'paymentpending';
          this.paymentpending = true;
        } else if (notificationtsearch.task[0][0].status == 7) {
          data.status = 'completed';
          this.completed = true;
        } else if (notificationtsearch.task[0][0].status == 8) {
          data.status = 'cancelled';
          this.cancelled = true;
        } else if (notificationtsearch.task[0][0].status == 9) {
          data.status = 'disputed';
          this.assigned = true;
        }
      } else {
        this.assigned = true;
        this.ongoing = false;
        this.paymentpending = false;
        this.completed = false;
        this.cancelled = false;
      }
      if (carddetails) {
        data.status = 'completed';
        this.completed = true;
        this.assigned = false;
        this.ongoing = false;
        this.paymentpending = false;
        this.cancelled = false;
        localStorage.removeItem('carddetails');
      }
      this.store.landingdata.subscribe((result: any) => {
        if (result && typeof result.settings != 'undefined') {
          this.settings = result.settings;
          this.DefaultCurrency = result.currencies.filter(x => x.default === 1)[0];
        }
      });
      localStorage.removeItem('notificationdata');
      if (this.currentuser.user_type === 'user') {
        this.getusertasklist(data);
      } else {
        this.gettaskertasklist(data);
      }
    }
  }
  dateSelected(date) {
    this.fromdate = date;
  }
  dateSelectedend(date) {
    this.todate = date;
  }
  getusertasklist(data) {
    this.tasklist = [];
    this.count = 0;
    this.ApiService.gettasklist(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.tasklist = result.response.TaskDetails;
        this.count = result.response.count;
        this.hidespinner();
      } else {
        this.hidespinner();
        //this.errorsmsg(result.response);
      }
    });
  }
  gettaskertasklist(data) {
    this.tasklist = [];
    this.count = 0;
    this.ApiService.getTaskDetailsByStaus(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.tasklist = result.response.TaskDetails;
        this.count = result.response.count;
        this.hidespinner();
      } else {
        this.hidespinner();
        //this.errorsmsg(result.response);
      }
    });
  }
  clearSearch() {
    localStorage.removeItem('notificationdata');
    this.fromdate = '';
    this.todate = '';
    this.jobid = 'CFC-';
    this.tasklist = [];
    this.count = 0;
    this.getTaskLists(this.task);
  }
  searchtask() {
    if (this.fromdate != '' && this.todate != '' && this.jobid === 'CFC-') {
      this.tasklist = [];
      this.count = 0;
      this.showspinner();
      let data = {
        _id: this.currentuser.user_id,
        status: this.task,
        skip: this.skip,
        limit: this.limit,
        lang: "en",
        taskfrom: moment(this.fromdate, 'DD/MM/YYYY').format('DD-MMM-YYYY'),
        taskto: moment(this.todate, 'DD/MM/YYYY').format('DD-MMM-YYYY'),
      }
      if (this.currentuser.user_type === 'user') {
        this.getusertasklist(data);
      } else {
        this.gettaskertasklist(data);
      }
    } else if (this.jobid != 'CFC-') {
      let data = {
        _id: this.currentuser.user_id,
        status: this.task,
        skip: 0,
        limit: 5,
        lang: "en",
        booking_id: this.jobid,
        taskfrom: moment(this.fromdate, 'DD/MM/YYYY').format('DD-MMM-YYYY'),
        taskto: moment(this.todate, 'DD/MM/YYYY').format('DD-MMM-YYYY'),
      }
      if (this.currentuser.user_type === 'user') {
        this.getusertasklist(data);
      } else {
        this.gettaskertasklist(data);
      }
    } else if (this.fromdate != '' && this.todate != '' && this.jobid != 'CFC-') {
      let data = {
        _id: this.currentuser.user_id,
        status: this.task,
        skip: this.skip,
        limit: this.limit,
        lang: "en",
        booking_id: this.jobid
      }
      if (this.currentuser.user_type === 'user') {
        this.getusertasklist(data);
      } else {
        this.gettaskertasklist(data);
      }
    } else {
      this.errorsmsg('Please enter any one fillter feilds.');
      //this.ngOnInit();
    }
  }
  showdetails(item, key) {
     let status = '';
    switch (item.status) {
      case 1:
        status = 'Assigned';
        break;
      case 2:
        status = 'Ongoing';
        break;
      case 3:
        status = 'Ongoing';
        break;
      case 4:
        status = 'Ongoing';
        break;
      case 5:
        status = 'Ongoing';
        break;
      case 6:
        status = 'Payment Pending';
        break;
      case 7:
        status = 'Completed';
        break;
      case 8:
        status = 'Cancelled';
        break;
      case 9:
        status = 'Disputed';
        break;
    }
    item.taske_status = status;   
    this.modalservice.show('View Job Details', item, key);
  }
  canceltask(id, status, key) {
    this.showspinner();
    this.canceldata_values = { id: id, status: status, key: key }
    let data = {
      type: this.currentuser.user_type
    }
    this.ApiService.getcancelreason(data).subscribe((result: any) => {
      if (result && result.response) {
        this.canceldata = result.response;
        this.hidespinner();
        this.modalservice.canceljob('Cancel Job', key, this.canceldata, (responce) => {
          // this.store.Canceljob.subscribe((responce: any) => {
          if (responce) {
            this.confirmed(responce);
          }
          // });
        }, () => {
        });
      } else {
        this.hidespinner();
      }
    })
  }
  confirmed(responce) {
    // this.showspinner();
    if (responce.reasons === 'Other') {
      if (responce.otherdata != '') {
        let data = {
          task_id: this.canceldata_values.id,
          status: this.canceldata_values.status,
          reasons: responce.otherdata,
          timestamp: new Date().toISOString(),
          task_date: moment().format('DD-MMMM-YYYY'),
          task_time: moment().format('HH:mm'),
          user_type: this.currentuser.user_type
        }
        this.ApiService.usercanceltask(data).subscribe((result: any) => {
          this.socket.emit('notifictions', this.currentuser);
          if (result.status === 1) {
            this.store.notificationemit.next('newnotification');
            this.ngOnInit();
            this.getTaskLists('cancelled');
            this.modalservice.updatemessage();
            this.successmsg('Succesfully updated!.');
            this.hidespinner();
          } else {
            this.hidespinner();
            this.errorsmsg(result.response);
          }
        });
      }
    } else if (responce.reasons != '') {
      let data = {
        task_id: this.canceldata_values.id,
        status: this.canceldata_values.status,
        reasons: responce.reasons,
        timestamp: new Date().toISOString(),
        task_date: moment().format('DD-MMMM-YYYY'),
        task_time: moment().format('HH:mm'),
        user_type: this.currentuser.user_type
      }
      this.ApiService.usercanceltask(data).subscribe((result: any) => {
        this.socket.emit('notifictions', this.currentuser);
        if (result.status === 1) {
          this.store.notificationemit.next('newnotification');
          this.ngOnInit();
          this.modalservice.updatemessage();
          this.getTaskLists('cancelled');
          this.successmsg('Succesfully updated!.');
          this.hidespinner();
        } else {
          this.hidespinner();
          this.errorsmsg(result.response);
        }
      });
    } else {
      this.errorsmsg('Please select one!.')
    }
  }
  getTaskLists(task) {
    localStorage.removeItem('notificationdata');
    this.jobid = 'CFC-';
    this.showspinner();
    if (task === 'assigned') {
      this.assigned = true;
      this.paymentpending = false;
      this.ongoing = false;
      this.completed = false;
      this.cancelled = false;
      this.getTasks(task);
    } else if (task === 'ongoing') {
      this.assigned = false;
      this.paymentpending = false;
      this.ongoing = true;
      this.completed = false;
      this.cancelled = false;
      this.getTasks(task);
    } else if (task === 'paymentpending') {
      this.assigned = false;
      this.paymentpending = true;
      this.ongoing = false;
      this.completed = false;
      this.cancelled = false;
      this.getTasks(task);
    } else if (task === 'completed') {
      this.assigned = false;
      this.paymentpending = false;
      this.completed = true;
      this.ongoing = false;
      this.cancelled = false;
      this.getTasks(task);
    } else if (task === 'cancelled') {
      this.assigned = false;
      this.paymentpending = false;
      this.cancelled = true;
      this.ongoing = false;
      this.completed = false;
      this.getTasks(task);
    } else {
      this.completed = false;
      this.paymentpending = false;
      this.assigned = true;
      this.ongoing = false;
      this.cancelled = false;
    }
  }
  getTasks(task) {
    this.tasklist = [];
    this.count = 0;
    this.task = task;
    let data = {
      _id: this.currentuser.user_id,
      status: this.task,
      skip: this.skip,
      limit: this.limit,
      lang: "en",
    }
    if (this.currentuser.user_type === 'user') {
      this.getusertasklist(data);
    } else {
      this.gettaskertasklist(data);
    }
  }
  openchat(item) {
    let data = {
      user_id: item.user.user_id,
      tasker_id: item.tasker.tasker_id,
      task_id: item._id,
      user_type: this.currentuser.user_type
    }
    localStorage.setItem('chat', JSON.stringify(data));
    this.router.navigate(['/chat']);
  }
  confirm(item) {
    this.sweetalert.confirm("Are you sure to confrim this Task?", () => {
      this.confrimfun(item);
    }, () => {
      //alert("No clicked");  
    });
  }
  confrimfun(item) {
    this.showspinner();
    let data = {
      taskid: item._id,
      timestamp: new Date().toISOString(),
      task_date: moment().format('DD-MMMM-YYYY'),
      task_time: moment().format('HH:mm'),
      taskerid: item.tasker.tasker_id,
      taskstatus: 2,
      user_type: this.currentuser.user_type
    };
    this.ApiService.taskerconfirmtask(data).subscribe((result: any) => {
      this.socket.emit('notifictions', this.currentuser);
      if (result.status === 1) {
        this.store.notificationemit.next('newnotification');
        this.ngOnInit();
        this.getTaskLists('ongoing');
        this.successmsg('Succesfully updated!.');
        this.hidespinner();
      } else {
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    })
  }
  startoff(item) {
    let data = {
      taskid: item._id,
      timestamp: new Date().toISOString(),
      task_date: moment().format('DD-MMMM-YYYY'),
      task_time: moment().format('HH:mm'),
      status: 3,
      time_zone: item.task_details.time_zone,
      user_type: this.currentuser.user_type
    };
    this.taskstatusupdate(data);
  }
  arrived(item) {
    let data = {
      taskid: item._id,
      timestamp: new Date().toISOString(),
      task_date: moment().format('DD-MMMM-YYYY'),
      task_time: moment().format('HH:mm'),
      status: 4,
      time_zone: item.task_details.time_zone,
      user_type: this.currentuser.user_type
    };
    this.taskstatusupdate(data);
  }
  startjob(item) {
    let data = {
      taskid: item._id,
      timestamp: new Date().toISOString(),
      task_date: moment().format('DD-MMMM-YYYY'),
      task_time: moment().format('HH:mm'),
      status: 5,
      time_zone: item.task_details.time_zone,
      user_type: this.currentuser.user_type
    };
    this.taskstatusupdate(data);
  }
  Complete(item) {
    this.completemodal = item;
    this.modalservice.completedjob('Miscellaneous Details', 'completedjob', this.completemodal, (responce) => {
      // this.store.completedjob.subscribe((responce: any) => {
      if (responce) {
        this.completeformsubmit(responce);
      }
      // });
    }, () => {
    });
  }
  completeformsubmit(responce) {
    let data = {
      task: this.completemodal,
      newdata: responce.newdata,
      setting: this.settings,
      timestamp: new Date().toISOString(),
      task_date: moment().format('DD-MMMM-YYYY'),
      task_time: moment().format('HH:mm'),
      user_type: this.currentuser.user_type
    }
    this.ApiService.updatetaskcompletion(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.store.notificationemit.next('newnotification');
        this.ngOnInit();
        this.getTaskLists('ongoing');
        this.successmsg('Succesfully updated!.');
        this.hidespinner();
        this.modalservice.updatemessage();
      } else {
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    })
  }

  review(item) {
    this.reviewjob = item;
    this.modalservice.reviewjob('Review', 'reviewjob', (responce) => {
      // this.store.reviewjob.subscribe((responce:any)=>{
      if (responce) {
        this.submitreview(responce);
      }
      // });
    }, () => {
      // this.store.reviewjob.next('');
    });
  }
  submitreview(responce) {
    let data = {
      rating: responce.rating,
      comments: responce.comments,
      user: this.reviewjob.user.user_id,
      tasker: this.reviewjob.tasker.tasker_id,
      task: this.reviewjob._id,
      type: this.currentuser.user_type,
    };
    this.ApiService.insertaskerReview(data).subscribe((result: any) => {
      localStorage.removeItem('reviewjob');
      if (result.status === 1) {
        this.getTaskLists(this.task);
        this.successmsg('Succesfully updated!.');
        this.hidespinner();
        this.modalservice.updatemessage();
      } else {
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    })
  }
  taskstatusupdate(data) {
    this.ApiService.updatetaskstatus(data).subscribe((result: any) => {
      this.socket.emit('notifictions', this.currentuser);
      if (result.status === 1) {
        this.store.notificationemit.next('newnotification');
        this.ngOnInit();
        this.getTaskLists('ongoing');
        this.successmsg('Succesfully updated!.');
        this.hidespinner();
      } else {
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    });
  }
  pagechange(event) {
    if (this.currentpage != event) {
      this.activepagenumber = event;
      this.currentpage = event;
      let data = {
        _id: this.currentuser.user_id,
        status: this.task,
        skip: this.limit * (this.currentpage - 1),
        limit: this.limit * this.currentpage,
        lang: "en",
      }
      if (this.currentuser.user_type === 'user') {
        this.getusertasklist(data);
      } else {
        this.gettaskertasklist(data);
      }
      window.scrollTo(0, 0);
    }
  }
  ProceedToPay(item) {
    localStorage.setItem('taskpayment', JSON.stringify(item));
    this.router.navigate(['/carddeatil', 'message']);
  }

  getjob(){
    this.router.navigate(['/jobdetails'])
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
