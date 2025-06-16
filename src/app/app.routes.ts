import { Routes } from '@angular/router';
import { ExpenseComponent } from './Component/expense/expense.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { LoanComponent } from './loan/loan.component';
import { LoanHistoryComponent } from './loan-history/loan-history.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './auth.guard';

import { adminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './Admin/dashboard/dashboard.component';
import { UsersComponent } from './Admin/users/users.component';
import { UsersTransactionsComponent } from './Admin/users-transactions/users-transactions.component';




export const routes: Routes = [
   { path: '' , redirectTo: 'Login', pathMatch: 'full'},
   // Public Routes
   { path: 'Signup', component: SignupComponent },
   { path: 'Login', component: LoginPageComponent },
   //Admin routes protected
   { path:'AdminDashboard',component:AdminDashboardComponent , canActivate:[adminGuard]},
   { path: 'AdminUsers' , component: UsersComponent , canActivate:[adminGuard]},
   { path: 'UserTransactions' , component: UsersTransactionsComponent , canActivate:[adminGuard]},

   // User routes protected
   { path: 'Expense', component: ExpenseComponent ,canActivate:[authGuard]},
   { path: 'Dashboard', component: DashboardComponent, canActivate:[authGuard] },
   { path: 'Loan', component: LoanComponent ,canActivate:[authGuard]},
   { path: 'LoanData', component: LoanHistoryComponent ,canActivate:[authGuard]},
];
