import { Component, OnInit, Inject, HostListener, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store/store.service';
import { CONFIG } from '../config';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { AlertService } from '../alert/alert.service';
import { DOCUMENT } from '@angular/common';
import { Socket } from 'ngx-socket-io';
import { SpinnerService } from '../spinner/spinner.service';
import { SocketService } from "../socket.service";


@Component({
	selector: 'app-main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'(document:click)': 'close($event)',
	},
})
export class MainHeaderComponent implements OnInit {
	currentuser: any;
	changesimage: any;
	imageUrl = CONFIG.imageUrl;
	sidebardiv: boolean = false;
	currentuser_data: string = '';
	notificationCount: number = 0;
	@HostListener('document:click', ['$event.target'])
	public onClick(targetElement) {
		const clickedInside = this.eRef.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.sidebardiv = false;
			this.document.body.classList.remove('test');
		}
	}
	constructor(private router: Router,
		private toastr: AlertService,
		private store: StoreService,
		private sweetalert: ConfirmDialogService,
		private socket: Socket,
		private elementRef: ElementRef,
		private spinner: SpinnerService,
		private eRef: ElementRef,
		private cd: ChangeDetectorRef,
		private SocketService: SocketService,
		@Inject(DOCUMENT) private document: Document) {
		this.sidebardiv = false;
		this.store.headermsg.subscribe((result: any) => {			
			this.currentuser_data = '';
			if (result && this.currentuser && result.role != 'user') {
				if (result.username && this.currentuser) {
					this.currentuser.user = result.username;
				}
				if (result && result.status != 1 && result.role != 'user') {
					this.currentuser_data += `<span>Your Account Verification Is Pending.</span><br>`;
				}
				if (result && !result.banking && result.role != 'user') {
					this.currentuser_data += '<span>Kindly provide bank details to receive your payouts..</span>';
				}
				this.elementRef.nativeElement.querySelector('.handy-home').click();
			}
		});
		this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
		this.store.Userdetails.subscribe((res: any) => {
			this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
			if (res != '' || this.currentuser) {
				this.currentuser = res ? res : JSON.parse(localStorage.getItem('currentuser'));
			} else {
				this.currentuser = undefined;
			}
		})
	}

	ngOnInit() {
		this.store.sidebar.subscribe(val => this.sidebardiv = val);
		if (this.currentuser) {
			this.socket.emit('notifictions', this.currentuser);
		}
		this.store.Useravater.subscribe((result) => {
			if (result) {
				this.currentuser = result;
			}
		});
		if (this.currentuser) {
			const data = {
				userId: this.currentuser.user_id,
				userrole: this.currentuser.user_type
			}
			this.store.profiledetails(data).subscribe((result: any) => {
				if (result.status === 1) {
					this.notificationCount = result.notificationCount;
					this.currentuser_data = '';
					this.currentuser.user = result.response[0].username;
					// this.store.profiledetails.next(result)
					if (result.response[0].role != 'user') {
						if (result && result.response && result.response[0].status != 1 && result.response[0].role != 'user') {
							this.currentuser_data += `<span>Your Account Verification Is Pending.</span><br>`;
						}
						if (result && result.response && !result.response[0].banking && result.response[0].role != 'user') {
							this.currentuser_data += '<span>Kindly provide bank details to receive your payouts..</span>';
						}
						this.elementRef.nativeElement.querySelector('.handy-home').click();
					}
				}
			});
		}
		// this.socket.on('webnotifictions', (data) => {			
		// 	let datalength = [];
		// 	for (let i = 0; i < data.length; i++) {
		// 		if (this.currentuser && this.currentuser.user_type == data[i].type && data[i].status == 1) {
		// 			datalength.push(data[i]);
		// 		}
		// 	}			
		// 	if(datalength.length > 0){
		// 		this.infomsg('You Have New Notifications');
		// 	}
		// 	this.notificationCount = datalength.length;
		// });
		// this.store.notificationemit.subscribe((resp: any) => {
		// 	if (resp == 'newnotification') {
		// 		this.socket.emit('notifictions', this.currentuser);
		// 	}
		// });
		this.SocketService.listen('usernotify').subscribe((respo: any) => {
			if (respo != '') {
				// console.log(respo);				
				this.infomsg(respo);
				const data = {
					userId: this.currentuser.user_id,
					userrole: this.currentuser.user_type
				}
				this.store.profiledetails(data).subscribe((result: any) => {
					if (result && result.status === 1) {
						this.notificationCount = result.notificationCount;
						this.currentuser_data = '';
						this.currentuser.user = result.response[0].username;
						// console.log(this.currentuser,'SocketService');						
						// this.store.profiledetails.next(result)
						if (result.response[0].role != 'user') {
							if (result && result.response && result.response[0].status != 1 && result.response[0].role != 'user') {
								this.currentuser_data += `<span>Your Account Verification Is Pending.</span><br>`;
							}
							if (result && result.response && !result.response[0].banking && result.response[0].role != 'user') {
								this.currentuser_data += '<span>Kindly provide bank details to receive your payouts..</span>';
							}
							this.elementRef.nativeElement.querySelector('.handy-home').click();
						}
					}
				});
			}
		})
	}
	onResize(event) {
		this.sidebardiv = false;
		this.document.body.classList.remove('test');
	}
	logout() {
		this.sweetalert.confirmlogout('', () => {
			this.store.Useravater.next('');
			this.document.body.classList.remove('test');
			localStorage.clear();
			this.store.Userdetails.next('');
			this.router.navigate(['']);
			this.successmsg('Successfully logout!!');
		}, () => {
			this.sweetalert.updatemessage();
		});
	}
	navbarbtn() {
		if (this.sidebardiv === true) {
			this.sidebardiv = false;
			this.document.body.classList.remove('test');
		} else {
			this.document.body.classList.add('test');
			this.sidebardiv = true;
		}
	}
	close(event) {
		// if(this.sidebardiv === true && this.document.body.classList){
		// 	this.document.body.classList.remove('test');
		// }	
	}
	homepage() {
		this.router.navigate(['']);
		this.sidebardiv = false;
		this.document.body.classList.remove('test');
	}
	messages() {
		if (this.router.url == '/messages') {
			this.hidespinner()
		} else {
			this.showspinner();
			this.router.navigate(['/messages']);
			this.sidebardiv = false;
			this.document.body.classList.remove('test');
		}
	}
	notifications() {
		if (this.router.url == '/notifications') {
			this.hidespinner()
		} else {
			this.showspinner();
			this.document.body.classList.remove('test');
			this.sidebardiv = false;
			this.router.navigate(['/notifications']);
			this.sidebardiv = false;
			this.document.body.classList.remove('test');
		}
	}
	profile() {
		if (this.router.url == '/account/profile') {
			this.hidespinner()
		} else {
			this.showspinner();
			this.router.navigate(['/account/profile']);
			this.sidebardiv = false;
			this.document.body.classList.remove('test');
		}
	}
	login() {
		this.showspinner();
		this.router.navigate(['/login']);
		this.sidebardiv = false;
		this.document.body.classList.remove('test');
	}
	register() {
		this.showspinner();
		this.router.navigate(['/register']);
		this.sidebardiv = false;
		this.document.body.classList.remove('test');
	}

	successmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 4000);
		this.toastr.success(msg);
	}
	errorsmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 4000);
		this.toastr.error(msg);
	}
	warningmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 4000);
		this.toastr.warn(msg);
	}
	infomsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 4000);
		this.toastr.info(msg);
	}
	showspinner() {
		this.spinner.Spinner('show');
	}
	hidespinner() {
		this.spinner.Spinner('hide');
	}
}