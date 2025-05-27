import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { ProductsComponent } from './admin/products/list/products.component';
import { CreateComponent } from './admin/products/create/create.component';
import { UpdateComponent } from './admin/products/update/update.component';
import { RegisterComponent } from './ui/components/register/register.component';


export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          title: 'Products',
          urls: [{ title: 'Products' }],
        },
      },
      {
        path:'products/create',
        component: CreateComponent,
      },
      {
        path:'products/update/:id',
        component: UpdateComponent,
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
      path: 'register',
      component: RegisterComponent,
    },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
