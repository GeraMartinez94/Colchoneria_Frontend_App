// src/app/components/login/login.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { AuthService } from '../../services/auth'; // Asegúrate de la ruta correcta
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
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
