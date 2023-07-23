import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure:false
})
export class TranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService) { }
  transform(key: any): any {    
   // if(typeof this.translate.data.TITLE != 'undefined'){
      return this.translate.data[key] || key;
    // }else{
    //   return '';
    // }
  }

}