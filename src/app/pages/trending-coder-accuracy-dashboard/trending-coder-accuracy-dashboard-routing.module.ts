import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrendingCoderAccuracyDashboardComponent } from './trending-coder-accuracy-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: TrendingCoderAccuracyDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrendingCoderAccuracyDashboardRoutingModule { }
