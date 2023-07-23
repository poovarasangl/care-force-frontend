import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
  <div class="modal fade" role="dialog" [ngStyle]="{'display': spinner}" aria-hidden="true" style="opacity: 1">
    <div class="loader">
        <div class="inner one"></div>
        <div class="inner two"></div>
        <div class="inner three"></div>
    </div>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnInit {

  @Input() spinner: string = 'none';

  constructor() { }

  ngOnInit() {

  }

}
