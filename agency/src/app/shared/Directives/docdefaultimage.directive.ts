import { Directive, ElementRef, Input } from '@angular/core';
import { CONFIG } from '../../config';

@Directive({
  selector: '[DocDefaultImage]',
})
export class DocDefaultImage {
  @Input() src;
  imageUrl = CONFIG.imageUrl;

  constructor(private imageRef: ElementRef) {
  }
  ngAfterViewInit(): void {
      const img = new Image();
      img.onload = () => {        
          this.setImage(this.src);
      };
      img.onerror = () => {
          this.setImage('assets/images/Default/document.jpg');
      };
      img.src = this.src;
  }
  private setImage(src: string) {    
      this.imageRef.nativeElement.setAttribute('src', src);
  }
}