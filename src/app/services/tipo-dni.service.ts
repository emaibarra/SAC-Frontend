import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoDniService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tipos-dni';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getTiposDni(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearTipoDni(tipoDni: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tipoDni, { headers: this.getHeaders() });
  }

  eliminarTipoDni(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}