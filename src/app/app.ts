// src/app/app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth'; // Importa tu AuthService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'El Galpón Colchonería';
  currentYear: number;
  // Propiedad para controlar la visibilidad del sidebar
  isSidebarOpen = false;
 isCategoriesDropdownOpen: boolean = false;
  // Inyecta AuthService y hazlo público para que sea accesible en la plantilla
  constructor(public authService: AuthService, private router: Router) {
    this.currentYear = new Date().getFullYear();
  }

  private authSubscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    // Suscribirse a los cambios de estado de autenticación
    this.authSubscriptions.add(
      this.authService.isAuthenticated$.subscribe(isAuthenticated => {
        // Esta suscripción asegura que la UI se actualice cuando el estado de autenticación cambie
        console.log('AppComponent: isAuthenticated updated to', isAuthenticated);
      })
    );
    this.authSubscriptions.add(
      this.authService.isAdmin$.subscribe(isAdmin => {
        // Esta suscripción asegura que la UI se actualice cuando el estado de administrador cambie
        console.log('AppComponent: isAdmin updated to', isAdmin);
      })
    );
    this.authSubscriptions.add(
      this.authService.username$.subscribe(username => {
        // Esta suscripción asegura que la UI se actualice cuando el nombre de usuario cambie
        console.log('AppComponent: username updated to', username);
      })
    );

    // Verificación inicial del estado de la sesión al cargar la aplicación
    this.authService.checkSessionStatus().subscribe();
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones para evitar fugas de memoria
    this.authSubscriptions.unsubscribe();
  }

  /**
   * Alterna el estado de visibilidad del sidebar (abre/cierra).
   */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Cierra el sidebar. Útil al hacer clic en un enlace de navegación.
   */
  closeSidebar() {
    this.isSidebarOpen = false;
  }

  /**
   * Maneja el evento de cerrar sesión.
   * Llama al método logout del AuthService y cierra el sidebar.
   */
  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout exitoso desde AppComponent.');
        this.closeSidebar(); // Cierra el sidebar al cerrar sesión
        // La redirección a /login ya se maneja en AuthService.logout()
      },
      error: (err) => {
        console.error('Error durante el logout desde AppComponent:', err);
        // Opcional: mostrar un mensaje de error al usuario
      }
    });
  }
  toggleCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = !this.isCategoriesDropdownOpen;
  }
}
