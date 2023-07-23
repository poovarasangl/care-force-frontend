import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-inner',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div *ngIf="list.length">
        <div *ngFor="let item of list"><span [innerHtml]="item"></span></div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-primary" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
    </div>
  `
})

export class ModalInnerComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
  tablefields: string= '';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.list.push('.');
  }
}
