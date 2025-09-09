import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

import { TrendingCoderAccuracyDashboardRoutingModule } from './trending-coder-accuracy-dashboard-routing.module';
import { TrendingCoderAccuracyDashboardComponent } from './trending-coder-accuracy-dashboard.component';


@NgModule({
  declarations: [
    TrendingCoderAccuracyDashboardComponent
  ],
  imports: [
    CommonModule,
    TrendingCoderAccuracyDashboardRoutingModule,
    ChartModule,
    CardModule,
    ButtonModule,
    MessageModule,
    MessagesModule
  ]
})
export class TrendingCoderAccuracyDashboardModule { }
