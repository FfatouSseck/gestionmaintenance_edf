import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './providers/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule',/*canActivate: [ AuthGuardService ]*/ },
  { path: 'create-notification', loadChildren: './pages/create-notification/create-notification.module#CreateNotificationPageModule',/*canActivate: [ AuthGuardService ]*/ },
  { path: 'notification-list', loadChildren: './pages/notification-list/notification-list.module#NotificationListPageModule',/*canActivate: [ AuthGuardService ]*/ },
  { path: 'notification-details', loadChildren: './pages/notification-details/notification-details.module#NotificationDetailsPageModule',/*canActivate: [ AuthGuardService ]*/ },
  { path: 'details-settings', loadChildren: './pages/details-settings/details-settings.module#DetailsSettingsPageModule',/*canActivate: [ AuthGuardService ]*/ },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'service-order-preparation', loadChildren: './pages/service-order-preparation/service-order-preparation.module#ServiceOrderPreparationPageModule' },


 // { path: "*",redirectTo:"/login"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
