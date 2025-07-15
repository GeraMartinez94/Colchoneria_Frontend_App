// src/app/services/auth.ts

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
  isAuthenticated$ = this._isAuthenticated.asObservable(); // Observable público para el estado de autenticación

  private _isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this._isAdmin.asObservable(); // Observable público para el estado de administrador

  private _username = new BehaviorSubject<string | null>(null);
  username$ = this._username.asObservable(); // Observable público para el nombre de usuario

  constructor(private http: HttpClient, private router: Router) {
    // Al iniciar el servicio, verifica el estado de la sesión
    // Esto es crucial para que el estado de autenticación se cargue al refrescar la página
    this.checkSessionStatus().subscribe();
  }

  /**
   * Método para iniciar sesión.
   * Envía las credenciales al backend y actualiza el estado de autenticación.
   * @param credentials Objeto que contiene el nombre de usuario y la contraseña.
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/login`, credentials, {
      withCredentials: true // Importante para enviar y recibir cookies de sesión
    }).pipe(
      tap((response: any) => {
        // Si el login es exitoso, actualiza los BehaviorSubjects con la información del usuario
        if (response && response.user) {
          this._isAuthenticated.next(true);
          this._isAdmin.next(response.user.is_admin);
          this._username.next(response.user.username);
          console.log('Login exitoso en AuthService:', response.user);
        }
      }),
      catchError(this.handleError) // Manejo de errores
    );
  }

  /**
   * Método para cerrar sesión.
   * Envía la solicitud de logout al backend y resetea el estado de autenticación.
   */
  logout(): Observable<any> { // Retorna un Observable<any> porque es una llamada HTTP
    return this.http.post(`${this.backendUrl}/logout`, {}, { // Endpoint de logout en tu Flask
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

  /**
   * Verifica el estado actual de la sesión con el backend.
   * Se llama al cargar la aplicación para mantener el estado de autenticación.
   */
  checkSessionStatus(): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/session_status`, {
      withCredentials: true // Importante para enviar la cookie de sesión
    }).pipe(
      tap((response: any) => {
        // Actualiza el estado de autenticación basado en la respuesta del backend
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
      catchError(this.handleError) // Manejo de errores
    );
  }

  /**
   * Método para subir archivos Excel e imágenes a la API.
   * @param formData Objeto FormData que contiene el archivo Excel y los archivos de imagen.
   */
    uploadExcelAndImages(formData: FormData): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/upload-excel`, formData, {
      withCredentials: true // Crucial para enviar la cookie de sesión
      // NOTA: No establezcas el Content-Type header manualmente para FormData.
      // El navegador lo establecerá automáticamente con el boundary correcto.
    }).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * Manejador centralizado de errores HTTP.
   * @param error El error HTTP recibido.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ocurrió.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de respuesta de error
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error.message || error.statusText}`;
      if (error.status === 401 || error.status === 403) {
        // Si es 401/403, el interceptor ya debería manejar la redirección o el mensaje de error
        console.error('Error de autenticación/autorización:', errorMessage);
      }
    }
    console.error(errorMessage);
    // Propaga el error para que el componente que llama pueda manejarlo
    return throwError(() => new Error(errorMessage));
  }
}