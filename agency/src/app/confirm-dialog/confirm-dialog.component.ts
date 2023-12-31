import { Component, OnInit } from '@angular/core';
import { ConfirmDialogService } from "../confirm-dialog/confirm-dialog.service";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass']
})
export class ConfirmDialogComponent implements OnInit {

  message:any=''; 
  constructor(  
      private confirmDialogService: ConfirmDialogService  
  ) { }  

  ngOnInit() {  
      //this function waits for a message from alert service, it gets   
      //triggered when we call this from any other component  
      this.confirmDialogService.getMessage().subscribe(message => {
        if(message){
          this.message = message;
        }else{
          this.message ='';
        }        
      });  
  }  

}
