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
import { HomeComponent } from './ui/components/home/home.component';
import { BasketsComponent } from './ui/components/baskets/baskets.component';

export const routes: Routes = [
  // 1. Public Pages (Login, Register gibi) - sade layout (BlankComponent)
  {
    path: '',
    component: BlankComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },

  // 2. Protected Pages (sidebar’lı layout) - FullComponent
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'admin',
        component: LayoutComponent,
        children: [
          { path: '', component: DashboardComponent },
          { path: 'customer', component: CustomerComponent },
          { path: 'product', component: ProductsComponent },
          { path: 'orders', component: OrdersComponent },
          { path: 'products/create', component: CreateComponent },
          { path: 'products/update/:id', component: UpdateComponent },
        ],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: '', component: StarterComponent,
      },
      {
        path: '', component: BlankComponent,
        children: [
          { path: 'home', component: HomeComponent },
          { path: 'baskets', component: BasketsComponent },
          { path: 'product', component: ProductsComponent },
          {
            path: 'authentication',
            loadChildren: () =>
              import('./pages/authentication/authentication.routes').then(
                (m) => m.AuthenticationRoutes
              ),
          },
          { path: '**', redirectTo: 'authentication/error' },
        ],
      },
    ],
  },
];
