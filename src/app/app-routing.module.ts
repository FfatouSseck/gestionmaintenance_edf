import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'create-notification', loadChildren: './pages/create-notification/create-notification.module#CreateNotificationPageModule' },
  { path: 'notification-list', loadChildren: './pages/notification-list/notification-list.module#NotificationListPageModule' },
  { path: 'notification-details', loadChildren: './pages/notification-details/notification-details.module#NotificationDetailsPageModule' },
  { path: 'details-settings', loadChildren: './pages/details-settings/details-settings.module#DetailsSettingsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
