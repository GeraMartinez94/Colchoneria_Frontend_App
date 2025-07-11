// Ejemplo: auth.service.ts o product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService { // O ProductService, etc.
  private backendUrl = 'https://colchoneria-backend.onrender.com'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) { }

  // Ejemplo de método de login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/login`, credentials, {
      withCredentials: true // <--- ¡Añade esta línea!
    });
  }

  // Ejemplo de subida de Excel
  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.backendUrl}/api/upload-excel`, formData, {
      withCredentials: true // <--- ¡Añade esta línea aquí también!
    });
  }

  // Ejemplo de obtención de productos
  getProducts(): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/productos`, {
      withCredentials: true // <--- ¡Añade esta línea a todas las solicitudes relevantes!
    });
  }

  // Ejemplo de verificación de sesión
  getSessionStatus(): Observable<any> {
    return this.http.get(`${this.backendUrl}/api/session_status`, {
      withCredentials: true // <--- Y aquí también
    });
  }

  // ... otros métodos ...
}
