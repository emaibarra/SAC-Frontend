import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  private http = inject(HttpClient);
  // Asegúrate de que esta URL coincida con el controlador en tu backend (Spring Boot)
  private apiUrl = 'http://localhost:8080/api/tecnicos';

  // Método privado para adjuntar el token de seguridad a las peticiones
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener la lista de todos los técnicos
  getTecnicos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Crear un nuevo técnico (enviando también sus credenciales de usuario)
  crearTecnico(tecnico: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tecnico, { headers: this.getHeaders() });
  }

  // Eliminar un técnico por su ID
  eliminarTecnico(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}