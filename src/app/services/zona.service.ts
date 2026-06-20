import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/zonas';

  // Función para obtener el token de seguridad
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todas las zonas
  getZonas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Crear una nueva zona
  crearZona(zona: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, zona, { headers: this.getHeaders() });
  }

  // Eliminar una zona por su ID
  eliminarZona(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}