import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then( m => m.routes)
  },
  {
    path: 'login',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
      },
    ]
  },

];
