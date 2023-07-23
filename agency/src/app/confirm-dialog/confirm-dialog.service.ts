import { Injectable } from '@angular/core';  
import { Router, NavigationStart } from '@angular/router';  
import { Observable } from 'rxjs';  
import { Subject } from 'rxjs/Subject';  

@Injectable() export class ConfirmDialogService {

    private subject = new Subject<any>();      

    constructor() { }  

    confirmThis(message: string, siFn: () => void, noFn: () => void) {          
        this.setConfirmation(message, siFn, noFn);  
    }  
    setConfirmation(message: string, siFn: () => void, noFn: () => void) {  
        let that = this;  
        this.subject.next({  
            type: "confirm", 
            logout : false,
            confirm : false,
            text: message,  
            siFn:  
                function () {  
                    that.subject.next(); //this will close the modal  
                    siFn();  
                },  
            noFn: function () {  
                that.subject.next();  
                noFn();  
            }  
        });  
  
    }   

    confirmlogout(message: string, siFn: () => void, noFn: () => void) {                  
        this.setConfirmationlogout(message, siFn, noFn);  
    }  
    setConfirmationlogout(message: string, siFn: () => void, noFn: () => void) {  
        let that = this;  
        this.subject.next({  
            type: "confirm", 
            logout : true, 
            confirm : false,
            text: message,  
            siFn:  
                function () {  
                    that.subject.next(); //this will close the modal  
                    siFn();  
                },  
            noFn: function () {  
                that.subject.next();  
                noFn();  
            }  
        });
    } 
    getMessage(): Observable<any> {  
        return this.subject.asObservable();  
    }  
    confirm(message: string, siFn: () => void, noFn: () => void) {                         
        let that = this;  
        this.subject.next({  
            type: "confirm", 
            logout : false,
            confirm : true, 
            text: message,  
            siFn:  
                function () {  
                    that.subject.next(''); //this will close the modal  
                    siFn();  
                },  
            noFn: function () {  
                that.subject.next('');  
                noFn();  
            }  
        });  
    }
    updatemessage(){
        this.subject.next('');  
    }
}  