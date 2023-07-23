import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { CustomComponent } from 'src/app/common/custom.component';
import { AdminService, Apiconfig } from 'src/app/_services';

@Component({
  selector: 'app-languagemanage',
  templateUrl: './languagemanage.component.html',
  styleUrls: ['./languagemanage.component.scss']
})
export class LanguagemanageComponent implements OnInit {
  editid: any;
  languagemanagedata: any[];
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 10;
  count: number = 0;
  default_limit: number = 10;
  editurl: string = '/app/settings/languages/languageedit';
  manageurl: string = '/app/settings/languages/manage';
  managemobileurl: string = '/app/settings/languages/mobile';
  addurl: string = '/app/settings/languages/manage-add';
  addbtn_name: string = 'language.add-new'
  deleteurl: string = Apiconfig.languagemanagedelete;
  changedValue: any = new Object;
  LanguageList: any[];
  spinner = 'none';
  current: number = 1;

  constructor(private Apiservice: AdminService,
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router) {
    this.loadsettings();
  }

  ngOnInit(): void {
    this.showspinner();
    this.editid = this.route.snapshot.paramMap.get('id');
    if (this.editid) {
      let data = {
        code: this.editid,
        current: this.current,
        'skip': this.skip,
        'limit': this.limit
      }
      this.Apiservice.CommonApi('post', Apiconfig.languagemanagelist, data).subscribe(
        (results) => {
          if (results.status == 1) {
            this.hidespinner();
            const objectArray = Object.entries(results.response.data);
            var keys = [];
            objectArray.forEach(([key, value]) => {
              keys.push({ content: key, value: value })
            });
            this.source.load(keys);
            this.count = results.response.total;
            this.cd.detectChanges();
          } else {
            this.hidespinner();
            return [];
          }
        });
      let languagelist = {
        'skip': this.skip,
        'limit': this.limit
      }
      this.Apiservice.CommonApi('post', Apiconfig.languagelist, languagelist).subscribe(
        (results) => {
          if (results.status == 1) {
            this.hidespinner();
            this.LanguageList = results.response;
            this.count = results.count;
            this.cd.detectChanges();
          }
        })
    }
  }
  onDeleteChange(event) {
    this.showspinner();
    // this.notifications.create('Success', 'Successfully deleted!.', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    // this.ngOnInit();
    let deletedata = {
      del: event.content,
      language: []
    }
    deletedata.language = this.LanguageList.map(x => {
      return { code: x.code }
    })
    this.Apiservice.CommonApi('post', Apiconfig.languagemanagedelete, deletedata).subscribe(
      (result) => {
        if (result.status == 1) {
          this.hidespinner();
          this.notifications.create('Success', result.response, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
          setTimeout(() => {
            this.ngOnInit();
          }, 2000);
        } else {
          this.hidespinner();
          this.notifications.create('Error', result.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        }
      }, (error) => {
        this.hidespinner();
        console.log(error);
      })
  }
  onPageChange(event) {
    this.showspinner();
    this.source = new LocalDataSource();
    let data = {
      'skip': this.limit * (event - 1),
      'limit': this.limit * event,
      code: this.editid,
      current: this.current + 1,
    }
    this.Apiservice.CommonApi('post', Apiconfig.languagemanagelist, data).subscribe((results: any) => {
      if (results.status == 1) {
        this.hidespinner();
        const objectArray = Object.entries(results.response.data);
        var keys = [];
        objectArray.forEach(([key, value]) => {
          keys.push({ content: key, value: value })
        });
        this.source.load(keys);
        this.count = results.response.total;
        this.cd.detectChanges();
      } else {
        this.hidespinner();
        return [];
      }
    });
  }
  onSearchChange(event) {
    this.showspinner();
    this.source = new LocalDataSource();
    let data = {
      code: this.editid,
      current: this.current,
      limit: 10,
      search: event
    };
    this.Apiservice.CommonApi('post', Apiconfig.languagemanagelist, data).subscribe(
      (results: any) => {
        if (results.status === 1) {
          this.hidespinner();
          const objectArray = Object.entries(results.response.data);
          var keys = [];
          objectArray.forEach(([key, value]) => {
            keys.push({ content: key, value: value })
          });
          this.source.load(keys);
          this.count = results.response.total;
          this.cd.detectChanges();
        } else {
          this.hidespinner();
          return;
        }
      });
  }
  onitemsPerPageChange(event) {
    this.showspinner();
    this.limit = event;
    this.default_limit = event;
    this.skip = 0;
    this.source = new LocalDataSource();
    let data = {
      code: this.editid,
      current: this.current,
      'skip': this.skip,
      'limit': this.limit
    }
    this.Apiservice.CommonApi('post', Apiconfig.languagemanagelist, data).subscribe(
      (results: any) => {
        if (results.status === 1) {
          this.hidespinner();
          const objectArray = Object.entries(results.response.data);
          var keys = [];
          objectArray.forEach(([key, value]) => {
            keys.push({ content: key, value: value })
          });
          this.source.load(keys);
          this.count = results.response.total;
          this.cd.detectChanges();
        } else {
          this.hidespinner();
          return;
        }
      });
  }
  submiteBtn() {
    this.showspinner();
    if (this.changedValue) {
      this.Apiservice.CommonApi('post', Apiconfig.languagemanagesave, { data: this.changedValue, id: this.editid }).subscribe(
        (result) => {
          if (result.status == 1) {
            this.hidespinner();
            this.notifications.create('Success', 'Language Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            this.ngOnInit();
            setTimeout(() => {
              this.router.navigate(['app/settings/languages/languagelist']);
            }, 1000);
          } else {
            this.hidespinner();
            this.notifications.create('Error', result.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
          }
        }, (error) => {
          console.log(error);
          this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        })
    } else {
      this.hidespinner();
      this.notifications.create('Error', 'No Values Changed!.', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
  loadsettings() {
    this.settings = {
      selectMode: 'multi',
      hideSubHeader: true,
      columns: {
        content: {
          title: 'Content',
          filter: true,
          class: 'content-class'
        },
        value: {
          title: 'Value',
          filter: false,
          type: "custom",
          renderComponent: CustomComponent,
          sort: false,
          editable: true,
          onComponentInitFunction: (instance: any) => {
            instance.save.subscribe(row => {
              this.changedValue[row.content] = row.value;
            });
          }
        },
      },
      pager: {
        display: true,
        perPage: this.default_limit
      },
      actions: {
        add: false,
        edit: false,
        delete: false,
        // columnTitle: 'Actions',
        class: 'action-column',
        position: 'right',
        custom: [
          //     // {
          //     //   name: 'editaction',
          //     //   type: 'html',
          //     //   title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
          //     // },
          //     // {
          //     //   name: 'manageaction',
          //     //   title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="iconsminds-management"></i></div>',
          //     //   type: 'html',
          //     // },
          //     // {
          //     //   name: 'managemobileaction',
          //     //   title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="iconsminds-smartphone-4"></i></div>',
          //     //   type: 'html',
          //     // },
          //     {
          //       name: 'managedeleteaction',
          //       value: 'Delete',
          //       title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
          //       type: 'html',
          //     }
        ],
      },
    }
  }
}
