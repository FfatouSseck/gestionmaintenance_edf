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
  { path: 'service-order-preparation', loadChildren: './pages/service-order-preparation/service-order-preparation.module#ServiceOrderPreparationPageModule' },  { path: 'order-details', loadChildren: './pages/order-details/order-details.module#OrderDetailsPageModule' },
  { path: 'check-list-assignment', loadChildren: './pages/check-list-assignment/check-list-assignment.module#CheckListAssignmentPageModule' },
  { path: 'service-order', loadChildren: './pages/service-order/service-order.module#ServiceOrderPageModule' },
  { path: 'time-and-material-confirmation', loadChildren: './pages/time-and-material-confirmation/time-and-material-confirmation.module#TimeAndMaterialConfirmationPageModule' },
  { path: 'documents', loadChildren: './pages/documents/documents.module#DocumentsPageModule' },
  { path: 'my-orders', loadChildren: './pages/my-orders/my-orders.module#MyOrdersPageModule' },
  { path: 'similar-notifications', loadChildren: './pages/similar-notifications/similar-notifications.module#SimilarNotificationsPageModule' },
  { path: 'checklist', loadChildren: './pages/checklist/checklist.module#ChecklistPageModule' },
  { path: 'operation-details', loadChildren: './pages/operation-details/operation-details.module#OperationDetailsPageModule' },
  { path: 'standard-text-list', loadChildren: './pages/standard-text-list/standard-text-list.module#StandardTextListPageModule' },
  { path: 'plant-list', loadChildren: './pages/plant-list/plant-list.module#PlantListPageModule' },
  { path: 'work-center-list', loadChildren: './pages/work-center-list/work-center-list.module#WorkCenterListPageModule' },
  { path: 'employee-list', loadChildren: './pages/employee-list/employee-list.module#EmployeeListPageModule' },
  { path: 'act-type-list', loadChildren: './pages/act-type-list/act-type-list.module#ActTypeListPageModule' },
  { path: 'component-details', loadChildren: './pages/component-details/component-details.module#ComponentDetailsPageModule' },
  { path: 'checklist-details', loadChildren: './pages/checklist-details/checklist-details.module#ChecklistDetailsPageModule' },
  { path: 'order-time-and-material', loadChildren: './pages/order-time-and-material/order-time-and-material.module#OrderTimeAndMaterialPageModule' },
  { path: 'time-sheets-list', loadChildren: './pages/time-sheets-list/time-sheets-list.module#TimeSheetsListPageModule' },
  { path: 'components-list', loadChildren: './pages/components-list/components-list.module#ComponentsListPageModule' },



 // { path: "*",redirectTo:"/login"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
