// src/app/app.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
// import { ProductService } from './services/product-service'; // No es necesario para la lógica del navbar
import { Subscription, Observable } from 'rxjs'; // Importa Observable
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,

  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // Usa styleUrls en lugar de styleUrl para un array
})
export class App implements OnInit, OnDestroy {
  title = 'El Galpón Colchonería';
  currentYear: number;

  // Ahora estas propiedades son Observables directamente del servicio
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  username$: Observable<string | null>;

  isNavbarOpen: boolean = false; // <-- Estado para controlar el menú móvil

  // No necesitamos una Subscription para los observables del AuthService si usamos async pipe
  // private authSubscription: Subscription = new Subscription();

  constructor(
    // private productService: ProductService, // No es necesario inyectar si no se usa aquí
    private authService: AuthService,
    private router: Router // Mantenemos Router por si se necesita para navegación programática
  ) {
    this.currentYear = new Date().getFullYear();

    // Asigna los observables directamente desde el servicio al constructor
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isAdmin$ = this.authService.isAdmin$;
    this.username$ = this.authService.username$;
  }

  ngOnInit(): void {
    // El checkSessionStatus() se puede llamar aquí o, como lo tienes, en el constructor de AuthService
    // para que se verifique al inicio de la aplicación.
    // this.authService.checkSessionStatus().subscribe();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada exitosamente desde el componente App.');
        // El AuthService ya debería manejar la redirección a /login
      },
      error: (error) => {
        console.error('Error al cerrar sesión desde el componente App:', error);
        // Podrías mostrar un mensaje de error al usuario aquí
        this.authService.checkSessionStatus().subscribe(); // Re-verificar el estado si hubo un error
      }
    });
  }

  ngOnDestroy(): void {
    // Si no hay suscripciones manuales, no es estrictamente necesario un ngOnDestroy para desuscribirse
    // Si tuvieras otras suscripciones, las desuscribirías aquí.
    // this.authSubscription.unsubscribe();
  }

  // Método para alternar el estado del menú móvil
  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  // La lógica de loadCategories se ha eliminado para simplificar el ejemplo del navbar.
  // Si la necesitas, puedes reincorporarla o moverla a un componente de productos.
  /*
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
  */
}
