import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ɵConsole } from '@angular/core';
import { Row } from '../../../lib/data-set/row';

import { Grid } from '../../../lib/grid';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'ng2-st-tbody-custom',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <span *ngFor="let action of grid.getSetting('actions.custom')" [tooltip]="tootltipfun(action.value)">
      <a href="#"
         class="ng2-smart-action ng2-smart-action-custom-custom" 
         [innerHTML]="transform(action.title)" style="pointer-events: true"  [class.disabled]="checkbtnstate()"
         (click)="onCustom(action, $event)"></a> </span>
        `
})
export class TbodyCustomComponent {

    @Input() grid: Grid;
    @Input() row: Row;
    @Input() source: any;
    @Output() custom = new EventEmitter<any>();
    constructor(private sanitized: DomSanitizer) { }
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
    tootltipfun(value){
        let data = this.row.getData();
        if (data && typeof data.payee_status !== 'undefined') {
           if(data.payee_status == 0){
            return 'Pay';
           }else{
               return 'Paid';
           }
        }else{
            return value;
        }
    }
    checkbtnstate() {
        let data = this.row.getData();
        if (data && data.payee_status == 1) {
            return true;
        }
    }
    onCustom(action: any, event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.custom.emit({
            action: action.name,
            data: this.row.getData(),
            source: this.source
        });
    }

}
