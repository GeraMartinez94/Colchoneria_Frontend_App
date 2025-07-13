// src/app/app.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { ProductService } from './services/product-service';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    RouterLinkActive, // Importado aquí

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'El Galpón Colchonería';
  categories: string[] = [];
  currentYear: number;

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  username: string | null = null;
isNavbarOpen: boolean = false; // <-- Nuevo estado para controlar el menú móvil

  private authSubscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.authSubscription.add(
      this.authService.isAuthenticated$.subscribe(status => {
        this.isAuthenticated = status;
      })
    );
    this.authSubscription.add(
      this.authService.isAdmin$.subscribe(status => {
        this.isAdmin = status;
      })
    );
    this.authSubscription.add(
      this.authService.username$.subscribe(name => {
        this.username = name;
      })
    );

    this.authService.checkSessionStatus().subscribe();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada exitosamente desde el componente App.');
      },
      error: (error) => {
        console.error('Error al cerrar sesión desde el componente App:', error);
        this.authService.checkSessionStatus().subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  // Nuevo método para alternar el estado del menú móvil
  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categorías cargadas en el frontend:', this.categories);
      },
      error: (error) => {
        console.error('Error al cargar categorías en el frontend:', error);
      }
    });
  }
}