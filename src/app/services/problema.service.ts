import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProblemaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/problemas';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getProblemas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearProblema(problema: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, problema, { headers: this.getHeaders() });
  }

  actualizarProblema(id: number, problema: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, problema, { headers: this.getHeaders() });
  }

  eliminarProblema(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}