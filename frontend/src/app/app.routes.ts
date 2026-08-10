import { Routes } from '@angular/router';
import { AllocationsComponent } from './views/legacy/allocations-component/allocations-component';
import { AllocationsEditComponent } from './views/legacy/allocations-edit-component/allocations-edit-component';
import { StorageBoxesComponent } from './views/legacy/storage-boxes-component/storage-boxes-component';
import { StorageBoxesEditComponent } from './views/legacy/storage-boxes-edit-component/storage-boxes-edit-component';
import { TransactionsComponent } from './views/legacy/transactions-component/transactions-component';
import { TransactionsEditComponent } from './views/legacy/transactions-edit-component/transactions-edit-component';
import { DashboardComponent } from './views/dashboard-component/dashboard-component';

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
