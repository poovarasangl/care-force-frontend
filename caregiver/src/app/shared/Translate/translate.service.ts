import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreService } from "../../store/store.service";
@Injectable()
export class TranslateService {
  data: any = {};
  language = localStorage.getItem('lang') ? JSON.parse(localStorage.getItem('lang')).code : 'en';
  constructor(private http: HttpClient,private store : StoreService) {
    this.store.defaultlang.subscribe((data:string)=>{
      if(data !=''){
        this.use(data);
      }
    })
  }
  use(lang: string): Promise<{}> {
    if (this.language && lang == '') {
      lang = this.language;
    }
    return new Promise<{}>((resolve, reject) => {
      const langPath = `assets/Languagefiles/${lang || 'en'}.json`;
      this.http.get<{}>(langPath).subscribe(
        translation => {          
          this.data = Object.assign({}, translation || {});
          resolve(this.data);
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }
}