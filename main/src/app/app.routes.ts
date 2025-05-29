import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { ProductsComponent } from './admin/products/list/products.component';
import { CreateComponent } from './admin/products/create/create.component';
import { UpdateComponent } from './admin/products/update/update.component';
import { RegisterComponent } from './ui/components/register/register.component';
import { LoginComponent } from './ui/components/login/login.component';
import { authGuard } from './guards/common/auth.guard';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CustomerComponent } from './admin/customer/customer.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { StarterComponent } from './pages/starter/starter.component';


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
        path: 'admin',
        component: LayoutComponent, children: [
          { path:"" ,component: DashboardComponent ,data: { title: 'Dashboard', urls: [{ title: 'Dashboard' }],},},
          { path:"customer" ,component: CustomerComponent ,data: { title: 'Customer', urls: [{ title: 'Customer' }],},},
          { path:"product" , component: ProductsComponent ,data: { title: 'Products', urls: [{ title: 'Products' }],},},
          { path: "orders", component: OrdersComponent ,data: { title: 'Orders', urls: [{ title: 'Orders' }],},},
          { path: "products/create", component: CreateComponent },
          { path:'products/update/:id', component: UpdateComponent},
          { path: 'dashboard', loadChildren: () =>import('./pages/pages.routes').then((m) => m.PagesRoutes),},
       ], //  canActivate: [authGuard]
      },
      {
      path: '', component: StarterComponent, data: { title: 'Starter Page', urls: [ { title: 'Dashboard', url: '/dashboards/dashboard1' }, { title: 'Starter Page' },],},
      },
      { path: 'ui-components',loadChildren: () =>import('./pages/ui-components/ui-components.routes').then((m) => m.UiComponentsRoutes ),},
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '', component: BlankComponent,children: [{ path: 'login',component: LoginComponent, },
      { path: 'register', component: RegisterComponent, },
      { path: 'authentication', loadChildren: () =>import('./pages/authentication/authentication.routes').then( (m) => m.AuthenticationRoutes ),},]
  },  { path: '**', redirectTo: 'authentication/error',},
];
