import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // <--- ¡CAMBIO AQUÍ!
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig) // <--- Y aquí también
  .catch((err) => console.error(err));