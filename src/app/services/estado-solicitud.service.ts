import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoSolicitudService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/estados';

  // Obtenemos el token del LocalStorage para la seguridad
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearEstado(estado: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, estado, { headers: this.getHeaders() });
  }

  eliminarEstado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}