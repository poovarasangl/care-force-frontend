import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'usernamefilter' })
export class UserFilterPipe implements PipeTransform {

    transform(items: any, key: string) {
        
        var Username = {} as any;
        if (items && key) {
            var user : any = items.user.user_id === key;
            var tasker : any = items.tasker.tasker_id === key;                        
            if (user || tasker) {
                Username.messagername = user ? items.user.username : items.tasker.username;
                Username.messagerimage = user ? items.user.avatar : items.tasker.avatar;                
            } else {
                Username.messagername = '';
                Username.messagerimage = '';
            }
        }else{
            Username.messagername = '';
            Username.messagerimage = '';
        }                 
        return Username;
    };
}