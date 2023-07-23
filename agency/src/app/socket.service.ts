import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subscriber } from 'rxjs';
import * as io from "socket.io-client";
import { CONFIG } from "./config";
import { StoreService } from "./store/store.service";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  currentUser: any;

  constructor(private socket: Socket, private store: StoreService) {
    this.socket = io(`${CONFIG.imageUrl}chat`);

    this.currentUser = JSON.parse(localStorage.getItem('currentuser'));

    this.socket.on('start typing', (data) => {
      let val = { type: 'start_typing', data: data };
      this.store.SocketListen.next(val)
    })

    this.socket.on('webupdatechat', (data) => {
      let val = { type: 'webupdatechat', data: data };
      // this.socket.emit('message count', this.currentUser);
      this.store.SocketListen.next(val)
    })

    this.socket.on('stop typing', (data) => {
      let val = { type: 'stop_typing', data: data };
      this.store.SocketListen.next(val)
    })

    this.socket.on('message status', (data) => {
      let val = { type: 'message_status', data: data };
      this.store.SocketListen.next(val)
    })

    this.socket.on('single message status', (data) => {
      let val = { type: 'single_message_status', data: data };
      this.store.SocketListen.next(val)
    })

    this.socket.on('message count', (data) => {
      let val = { type: 'message_count', data: data };
      this.store.SocketListen.next(val)
    })

  }
  public websocketConnect() {
    return this.socket;
  }
  public listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    })
  }
  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}