import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaPrecioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/lista-precios';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getListasPrecio(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearListaPrecio(lista: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, lista, { headers: this.getHeaders() });
  }

  actualizarListaPrecio(id: number, lista: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, lista, { headers: this.getHeaders() });
  }

  eliminarListaPrecio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}