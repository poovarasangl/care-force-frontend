import { Directive, ElementRef, Input } from '@angular/core';
import { StoreService } from '../../store/store.service';
import { CONFIG } from '../../config';

@Directive({
  selector: '[UserDefaultImage]',
})
export class UserDefaultImage {
  @Input() src;
  imageUrl = CONFIG.imageUrl;

  constructor(private imageRef: ElementRef, private store: StoreService) {
  }
  ngAfterViewInit(): void {
      const img = new Image();
      img.onload = () => {
        // this.store.Useravater.subscribe(({avatar})=> {
        //   if (avatar) {
        //     this.setImage(this.imageUrl + avatar);
        //   }else{
            this.setImage(this.src);
        //   }
        // });
      };
      img.onerror = () => {
          this.setImage('assets/images/Default/user.jpg');
      };
      img.src = this.src;
  }
  private setImage(src: string) {    
      this.imageRef.nativeElement.setAttribute('src', src);
  }
}