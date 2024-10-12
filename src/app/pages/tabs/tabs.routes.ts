import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/chats',
        pathMatch: 'full',
      },
      {
        path: 'chats',
        loadComponent: () =>
          import('./chats/chats.page').then((m) => m.ChatsPage),
      },
      {
        path: 'status',
        loadComponent: () =>
          import('./status/status.page').then((m) => m.StatusPage),
      },
      {
        path: 'calls',
        loadComponent: () =>
          import('./calls/calls.page').then((m) => m.CallsPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/chats',
    pathMatch: 'full'
  }
];
