import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })

export class FilterPipe implements PipeTransform {

    transform(items: Array<any>, key: any) {
        var taskerDoc = {} as any;
        if (items && typeof key != 'string') {
            var index = items.findIndex(function (e) { return (e._id === key._id && e.replace_name === key.replace_name) });
            if (index !== -1) {
                taskerDoc = items[index];
                taskerDoc.status = true;
            } else {
                taskerDoc.status = false;
            }
        } else if (items && typeof key == 'string') {
            var index = items.findIndex(function (e) { return (e.replace_name === key) });
            if (index !== -1) {
                taskerDoc = items[index];
                taskerDoc.status = true;
            } else {
                taskerDoc.status = false;
            }
        }
        else {
            taskerDoc.status = false;
        }
        return taskerDoc;

    };
}