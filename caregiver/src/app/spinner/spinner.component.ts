import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.sass']
})
export class SpinnerComponent implements OnInit {

  spinner:string ='none';

  constructor(private spinnerservice : SpinnerService) { }

  ngOnInit() {
    this.spinnerservice.getMessage().subscribe((result:any)=>{
      this.spinner = result;     
    })
  }
}
