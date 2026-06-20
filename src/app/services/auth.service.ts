import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth/login';

  // Método para enviar credenciales y guardar el token si es exitoso
  login(credenciales: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credenciales).pipe(
      tap(respuesta => {
        if (respuesta && respuesta.token) {
          localStorage.setItem('token', respuesta.token);
        }
      })
    );
  }

  // Método para recuperar el token del almacenamiento
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // NUEVO: Método para obtener el rol actual
  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaLogueado(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol'); // NUEVO: Limpiamos el rol al salir
  }
  
}