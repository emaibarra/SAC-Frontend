import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  // URL base definida en tu controlador de Spring Boot
  private apiUrl = 'http://localhost:8080/api/zonas';

  constructor(private http: HttpClient) { }

  // Obtener todas las zonas
  getZonas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva zona
  crearZona(zona: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, zona);
  }

  // Eliminar una zona por ID
  eliminarZona(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}