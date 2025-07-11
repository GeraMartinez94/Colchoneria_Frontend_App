// src/app/components/login/login.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { AuthService } from '../../services/auth'; // Asegúrate de la ruta correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Si es standalone
  imports: [FormsModule], // Importar FormsModule
  template: `
    <div class="container">
      <h2>Iniciar Sesión</h2>
      <form (ngSubmit)="onLogin()">
        <div class="form-group">
          <label for="username">Usuario:</label>
          <input type="text" id="username" [(ngModel)]="username" name="username" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <div *ngIf="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </div>
  `,
  styleUrls: ['./login.css'] // O ['./login.ts.css']
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = null; // Resetear mensaje de error
    this.authService.login({ username: this.username, password: this.password }).subscribe({ // <--- ¡CAMBIO AQUÍ!
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/productos']); // Redirige a productos después del login
      },
      error: (err) => {
        console.error('Error durante el login:', err);
        this.errorMessage = err.error?.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
    });
  }
}
