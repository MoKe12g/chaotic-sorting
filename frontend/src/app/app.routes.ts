import { Routes } from '@angular/router';
import { AllocationsComponent } from './views/allocations-component/allocations-component';
import { StorageBoxesComponent } from './views/storage-boxes-component/storage-boxes-component';
import { TransactionsComponent } from './views/transactions-component/transactions-component';
import { DashboardComponent } from './views/dashboard-component/dashboard-component';
import { StorageBoxesEditComponent } from './views/storage-boxes-edit-component/storage-boxes-edit-component';
import { AllocationsEditComponent } from './views/allocations-edit-component/allocations-edit-component';
import { TransactionsEditComponent } from './views/transactions-edit-component/transactions-edit-component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  // storage box
  { path: 'storage-box/:id', component: StorageBoxesEditComponent },
  { path: 'storage-boxes', component: StorageBoxesComponent },
  { path: 'storage-boxes/:page', component: StorageBoxesComponent },
  // allocation
  { path: 'allocation/:id', component: AllocationsEditComponent },
  { path: 'allocations', component: AllocationsComponent },
  { path: 'allocations/:page', component: AllocationsComponent },
  // transaction
  { path: 'transaction/:id', component: TransactionsEditComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'transactions/:page', component: TransactionsComponent },
];
