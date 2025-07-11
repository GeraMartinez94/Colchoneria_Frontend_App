// src/app/app.ts (o app.component.ts)
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth'; // Asegúrate de la ruta correcta
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-root',
  standalone: true, // Si es standalone
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], // Importar módulos necesarios
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" routerLink="/">Colchonería</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" routerLink="/productos" routerLinkActive="active">Productos</a>
          </li>
          <li class="nav-item" *ngIf="isAdmin">
            <a class="nav-link" routerLink="/upload-excel" routerLinkActive="active">Subir Excel</a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" *ngIf="!isAuthenticated">
            <a class="nav-link" routerLink="/login" routerLinkActive="active">Login</a>
          </li>
          <li class="nav-item" *ngIf="isAuthenticated">
            <span class="navbar-text mr-3">Bienvenido, {{ username }}</span>
            <button class="btn btn-outline-danger my-2 my-sm-0" (click)="onLogout()">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.css'] // O ['./app.ts.css']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los observables del AuthService
    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });

    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });

    this.authService.username$.subscribe(name => {
      this.username = name;
    });

    // Verificar el estado de la sesión al inicializar el componente
    this.authService.checkSessionStatus().subscribe();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout exitoso.');
        // La redirección ya se maneja en el AuthService.logout()
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        // Aún si hay error en el logout del backend, forzamos el estado local
        this.authService.checkSessionStatus().subscribe();
      }
    });
  }
}
