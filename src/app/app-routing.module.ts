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
  { path: 'cause-group-list', loadChildren: './pages/cause-group-list/cause-group-list.module#CauseGroupListPageModule' },
  { path: 'cause-code-list', loadChildren: './pages/cause-code-list/cause-code-list.module#CauseCodeListPageModule' },
  { path: 'funct-loc-list', loadChildren: './pages/funct-loc-list/funct-loc-list.module#FunctLocListPageModule' },
  { path: 'equipment-list', loadChildren: './pages/equipment-list/equipment-list.module#EquipmentListPageModule' },  { path: 'object-part-group-list', loadChildren: './pages/object-part-group-list/object-part-group-list.module#ObjectPartGroupListPageModule' },
  { path: 'object-part-code-list', loadChildren: './pages/object-part-code-list/object-part-code-list.module#ObjectPartCodeListPageModule' },
  { path: 'damage-code', loadChildren: './pages/damage-code/damage-code.module#DamageCodePageModule' },
  { path: 'damage-group', loadChildren: './pages/damage-group/damage-group.module#DamageGroupPageModule' },


 // { path: "*",redirectTo:"/login"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
