// src/app/interceptors/auth.interceptor.ts (o el nombre que le hayas dado)
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; // Si usas Router para redirigir

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {} // Inyecta Router si lo necesitas

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clona la solicitud y añade withCredentials: true
    const clonedRequest = request.clone({
      withCredentials: true // <--- ¡Añade esta línea aquí!
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Redirigiendo a login debido a 401 Unauthorized desde el interceptor.');
          // Puedes añadir lógica para redirigir al login si lo deseas
          this.router.navigate(['/login']); // Ejemplo de redirección
        }
        return throwError(() => error); // Propaga el error
      })
    );
  }
}
