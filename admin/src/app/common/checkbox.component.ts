import { Component, Output, EventEmitter, Input } from "@angular/core";

@Component({
    selector: "checkbox-component",
    template: `
    <span>
    <input type="checkbox" *ngIf="value && value == 1" checked (click)="onModelChange()">
    <input type="checkbox" *ngIf="!value || value == 0" (click)="onModelChange()">
    </span>
  `
})
export class CheckboxComponent {
    rowData: any;
    @Input() value: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    onModelChange() {
        this.save.emit(this.rowData);
    }
}
