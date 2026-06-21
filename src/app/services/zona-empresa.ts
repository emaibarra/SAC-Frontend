import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaEmpresaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/zona-empresas';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getZonasPorEmpresa(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empresa/${empresaId}`, { headers: this.getHeaders() });
  }

  crearZonaEmpresa(zonaEmpresa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, zonaEmpresa, { headers: this.getHeaders() });
  }

  eliminarZonaEmpresa(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}