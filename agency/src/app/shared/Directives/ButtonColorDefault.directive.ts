import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[defaultbutton]',
})
export class ButtonDefaultstyle {

    constructor(private el: ElementRef,render:Renderer2){
        render.addClass(el.nativeElement,'btncolor');
    }
}