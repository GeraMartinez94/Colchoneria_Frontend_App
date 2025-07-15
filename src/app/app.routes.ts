// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list'
 // Asegúrate que la ruta es correcta
import {LoginComponent } from './components/login/login';
import { ProductDetailsComponent } from './components/product-details/product-details';
import { ProductUploadComponent } from './components/product-upload/product-upload';

export const routes: Routes = [
  { path: 'productos', component: ProductListComponent },
 { path: 'upload-products', component: ProductUploadComponent },
  { path: 'login', component: LoginComponent },
  { path: 'productos/:id', component: ProductDetailsComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: '**', redirectTo: '/productos' }
];