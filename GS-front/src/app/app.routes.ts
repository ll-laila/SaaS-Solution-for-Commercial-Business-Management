import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from "src/app/controller/auth/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    data: { title: 'Home' },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },

// START MY ENTITIES ---------------------------------------------->
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },

  {
  path: 'contacts',
  loadChildren: () => import('./views/contacts/routes').then((m) => m.routes)
  },
  {
  path: 'produit',
  loadChildren: () => import('./views/produit/routes').then((m) => m.routes)
  },
  {
  path: 'ventes',
  loadChildren: () => import('./views/ventes/routes').then((m) => m.routes)
  },
  {
  path: 'inventaire',
  loadChildren: () => import('./views/inventaire/routes').then((m) => m.routes)
  },
  {
  path: 'parametres',
  loadChildren: () => import('./views/parametres/routes').then((m) => m.routes)
  },
  {
  path: 'adresse',
  loadChildren: () => import('./views/adresse/routes').then((m) => m.routes)
  },
      {
        path: 'profil',
        loadComponent: () => import('./views/pages/profil/profil.component').then(m => m.ProfilComponent),
        data: {title: 'profil Page'}
      },
      {
        path: 'notification',
        loadComponent: () => import('./views/parametres/notification/notification.component').then(m => m.NotificationComponent),
        data: {title: 'notification Page'}
      }

    ]
  },

/////////////////////////////////////////////////////////////////////////////////////7
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {title: 'Page 404'}
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {title: 'Page 500'}
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {title: 'Login Page'}
  },

  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {title: 'Register Page'}
  },
  { path: '**', redirectTo: 'dashboard' }
];
