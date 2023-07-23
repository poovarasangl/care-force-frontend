import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from './alert.common';
import { AlertService } from './alert.service';
@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.sass']
})
export class AlertComponent implements OnInit {
    @Input() id: string;
    alerts: Alert[] = [];
    subscription: Subscription;
    constructor(private alertService: AlertService) { }
    ngOnInit() {
        this.subscription = this.alertService.getalert()
            .subscribe(alert => {
                if (!alert.message) {
                    this.alerts = [];
                    return;
                }
                this.alerts.push(alert);
            });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }
    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }
        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
}