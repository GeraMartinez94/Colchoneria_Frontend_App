// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importa withFetch
import { routes } from './app.routes';
import { AuthInterceptor } from './services/auth.interceptor'; // Asegúrate de que la ruta sea correcta

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Habilita la inyección de interceptores y añade withFetch()
    provideHttpClient(withFetch(), withInterceptorsFromDi()), // Añade withFetch() aquí
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Tu interceptor
  ]
};
