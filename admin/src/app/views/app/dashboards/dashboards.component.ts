import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartService } from 'src/app/components/charts/chart.service';
import { lineChartData, pieChartData } from 'src/app/data/charts';
import { AdminService, Apiconfig, AuthenticationService } from 'src/app/_services';


@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit {
  chartDataConfig: ChartService;
  pieChartData = pieChartData;
  lineChartData = lineChartData;
  dashboarddatas: any;
  earndatas: any;
  catgrystatsdatas: any;
  taskerstatsdatas: any;
  peichartData = {} as any;
  stripedatas: any;
  arrayone: any;
  arraytwo: any;
  availableamount: any;
  pendingamount: any;
  spinner: string = 'none';
  curentUser: any;
  userPrivilege: boolean = true;
  taskerPrivilege: boolean = true;
  taskPrivilege: boolean = true;
  catogoryPrivilege: boolean = true;

  constructor(
    private chartService: ChartService,
    private Apiservice: AdminService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.chartDataConfig = this.chartService;
    this.curentUser = this.authService.currentUserValue;
    if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
      if (this.router.url == '/app/dashboards') {
        let user = this.curentUser.user_details.privileges.filter(x => x.alias == 'users');
        let tasker = this.curentUser.user_details.privileges.filter(x => x.alias == "tasker");
        let task = this.curentUser.user_details.privileges.filter(x => x.alias == 'tasks');
        let catogory = this.curentUser.user_details.privileges.filter(x => x.alias == 'categories');
        if (user && user.length > 0) {
          this.userPrivilege = user[0].status.view;
        }
        if (tasker && tasker.length > 0) {
          this.taskerPrivilege = tasker[0].status.view;
        }
        if (task && task.length > 0) {
          this.taskPrivilege = task[0].status.view;
        }
        if (catogory && catogory.length > 0) {
          this.catogoryPrivilege = catogory[0].status.view;
        }
      }
    }
  }
  ngOnInit() {
    this.showspinner();
    this.Apiservice.CommonApi('get', Apiconfig.dashboardstats, {}).subscribe(
      (results) => {
        if (results.status == 1) {
          this.dashboarddatas = results.response;
          this.catgrystatsdatas = results.response.topcategories;
          this.taskerstatsdatas = results.response.toptasker;

          this.peichartData.TotalEarnings = this.dashboarddatas.earningStatistics.Total ? this.dashboarddatas.earningStatistics.Total.amount : 0;
          this.peichartData.TotalAdminEarnings = this.dashboarddatas.earningStatistics.Total ? this.dashboarddatas.earningStatistics.Total.adminEarnings : 0;
          this.peichartData.TotalServiceFee = this.dashboarddatas.earningStatistics.Total ? this.dashboarddatas.earningStatistics.Total.service_tax : 0;

          this.pieChartData.datasets[0].data = [this.peichartData.TotalEarnings, this.peichartData.TotalAdminEarnings, this.peichartData.TotalServiceFee]
        }
      })
    this.dashboardearnings();
    this.dashboardstripedats();
    setTimeout(() => {
      this.hidespinner();
    }, 1000);
  }

  dashboardearnings() {
    this.Apiservice.CommonApi('get', Apiconfig.dashboardearnings, {}).subscribe(
      (results) => {
        if (results.status == 1) {
          this.earndatas = results.response;
          let label = this.earndatas.earnings.map(x => x.month);
          this.lineChartData.labels = label.reverse();
          let datasets1 = this.earndatas.earnings.map(x => x.tasker_earnings);
          let datasets2 = this.earndatas.earnings.map(x => x.admin_earnings);
          let datasets3 = this.earndatas.earnings.map(x => x.amount);
          this.chartDataConfig.lineChartOptions.scales.yAxes[0].ticks.stepSize = this.earndatas.interval || 1;
          this.chartDataConfig.lineChartOptions.scales.yAxes[0].ticks.min = 0;
          this.chartDataConfig.lineChartOptions.scales.yAxes[0].ticks.max = this.earndatas.max_earnings || 1;
          this.chartDataConfig.lineChartOptions.scales.yAxes[0].gridLines.display = this.earndatas.max_earnings == 0 ? false : true;
          this.lineChartData.datasets[0].label = 'Tasker Earnings';
          this.lineChartData.datasets[0].data = datasets1.reverse();
          this.lineChartData.datasets[1].label = 'Admin Earninigs';
          this.lineChartData.datasets[1].data = datasets2.reverse();
          this.lineChartData.datasets[2].label = 'Site Earnings';
          this.lineChartData.datasets[2].data = datasets3.reverse();
        }
      })

  }
  dashboardstripedats() {
    this.Apiservice.CommonApi('get', Apiconfig.dashboardstripe, {}).subscribe(
      (results) => {
        if (results.status == 1) {
          this.stripedatas = results.response;
          this.arrayone = this.stripedatas[0];
          this.arraytwo = this.stripedatas[1];
          this.availableamount = this.arrayone.available[0];
          this.pendingamount = this.arrayone.pending[0];
        } else {
          this.arrayone = { mode: '' }
          this.arraytwo = {
            id: '',
            payouts_enabled: 'Inactive',
            charges_enabled: 'Inactive',
          }
          this.availableamount = {
            amount: 0,
          }
          this.pendingamount = {
            amount: 0,
          }
        }
      })
  }

  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}