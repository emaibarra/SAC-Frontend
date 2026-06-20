import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/provincias';

  // Obtenemos el token de seguridad para mandarlo al backend
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProvincias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearProvincia(provincia: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, provincia, { headers: this.getHeaders() });
  }

  eliminarProvincia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}