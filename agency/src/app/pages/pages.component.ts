import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagesService } from './pages.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.sass']
})
export class PagesComponent implements OnInit {
  pages:any;
  constructor( 
    private route: ActivatedRoute,
    private ApiService: PagesService,
    private toastr: AlertService,
    ) {
      route.params.subscribe(val => {
       this.ngOnInit();
      });
     }

  ngOnInit() {
    const data ={
      slug : this.route.snapshot.paramMap.get('slug')
    }
    this.ApiService.Getpage(data).subscribe(result => {
      if(result.status == 0){
        this.errorsmsg(result.response);
      }else{
        this.pages = result.response;
      }
    })
  }

  successmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.success(msg);
  }
  errorsmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.error(msg);
  }
  warningmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.warn(msg);
  }
}
