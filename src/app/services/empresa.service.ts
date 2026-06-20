import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/empresas'; // La URL de tu Spring Boot

  getEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  crearEmpresa(empresa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, empresa);
  }
}
