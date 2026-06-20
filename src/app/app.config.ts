import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor'; // IMPORTAR AQUÍ

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Agregamos withInterceptors a nuestra configuración HTTP
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};