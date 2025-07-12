// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  username: string;
  is_admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Asegúrate de que esta URL sea la de tu backend de Render
  private backendUrl = 'https://colchoneria-backend.onrender.com';

  // BehaviorSubjects para mantener el estado de autenticación de forma reactiva
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  private _isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this._isAdmin.asObservable();

  private _username = new BehaviorSubject<string | null>(null);
  username$ = this._username.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Al iniciar el servicio, verifica el estado de la sesión
    this.checkSessionStatus().subscribe();
  }

  // Método para iniciar sesión
  // Ahora espera un solo objeto 'credentials'
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/login`, credentials, {
      withCredentials: true // Crucial para enviar la cookie de sesión
    }).pipe(
      tap((response: any) => {
        // Si el login es exitoso, actualiza los BehaviorSubjects
        if (response && response.user) {
          this._isAuthenticated.next(true);
          this._isAdmin.next(response.user.is_admin);
          this._username.next(response.user.username);
          console.log('Login exitoso en AuthService:', response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Método para cerrar sesión
   logout(): Observable<any> {
    return this.http.post(`${this.backendUrl}/logout`, {}, {
      withCredentials: true // Importante para enviar la cookie de sesión
    }).pipe(
      tap(() => {
        // Al cerrar sesión, resetea todos los BehaviorSubjects
        this._isAuthenticated.next(false);
        this._isAdmin.next(false);
        this._username.next(null);
        console.log('Sesión cerrada en AuthService.');
        this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
      }),
      catchError(this.handleError) // Manejo de errores
    );
  }


  // Método para verificar el estado de la sesión al cargar la aplicación
  checkSessionStatus(): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/session_status`, {
      withCredentials: true // Crucial para enviar la cookie de sesión
    }).pipe(
      tap((response: any) => {
        if (response && response.is_authenticated) {
          this._isAuthenticated.next(true);
          this._isAdmin.next(response.is_admin);
          this._username.next(response.username);
        } else {
          this._isAuthenticated.next(false);
          this._isAdmin.next(false);
          this._username.next(null);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Método para subir el archivo Excel
  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.backendUrl}/api/upload-excel`, formData, {
      withCredentials: true // Crucial para enviar la cookie de sesión
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ocurrió.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de respuesta de error
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error.message || error.statusText}`;
      if (error.status === 401 || error.status === 403) {
        // Si es 401/403, el interceptor ya debería manejar la redirección
        console.error('Error de autenticación/autorización:', errorMessage);
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
