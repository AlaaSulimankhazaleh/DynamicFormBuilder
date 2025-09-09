import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'SignUp', loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule) },
  { path: 'FormBuilder',  canActivate: [AuthGuard], loadChildren: () => import('./pages/form-builder/form-builder.module').then(m => m.FormBuilderModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/trending-coder-accuracy-dashboard/trending-coder-accuracy-dashboard.module').then(m => m.TrendingCoderAccuracyDashboardModule) },
  { path: 'dashboard-protected', canActivate: [AuthGuard], loadChildren: () => import('./pages/trending-coder-accuracy-dashboard/trending-coder-accuracy-dashboard.module').then(m => m.TrendingCoderAccuracyDashboardModule) },
  { path: '**', redirectTo: '/login' }  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
