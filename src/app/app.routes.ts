import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; 
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },

  {
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'admin/usuarios',
        loadComponent: () => import('./components/user-management/user-list/user-list').then(m => m.UserListComponent)
      },
      
      // ... Aquí añadirás el resto de tus páginas internas (Tesorería, etc.)
      
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login' // Redirige a login si la URL no existe
  }
];