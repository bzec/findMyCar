import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'map',
        loadComponent: () => import('./map/map.page').then((m) => m.MapPage),
      },
      {
        path: 'list',
        loadComponent: () => import('./list/list.page').then((m) => m.ListPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.page').then((m) => m.SettingsPage),
      },
      { path: '', redirectTo: 'map', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'tabs/map', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/map' },
];
