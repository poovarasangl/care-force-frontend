import { Component, Output, EventEmitter, Input } from "@angular/core";

@Component({
    selector: "verify-icon-component",
    template: `
    <span class="status-btn">
    <button class="verify btn btn-success" aria-hidden="true" *ngIf="value && value != 1 || !value" (click)="onModelChange()">Verify</button>
    <button class="unverify btn btn-danger" aria-hidden="true" *ngIf="value && value == 1" (click)="onModelChange()">Unverify</button>
    </span>
  `
})
export class VerifyiconComponent {
    rowData: any;
    @Input() value: any;
    @Output() save: EventEmitter<any> = new EventEmitter();

    onModelChange() {
        this.save.emit(this.rowData);
    }
}
