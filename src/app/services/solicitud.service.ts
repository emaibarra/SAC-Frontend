import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/solicitudes';

  // Usamos la misma lógica que armaste en tu ProblemaService
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  buscarTecnicos(problemasIds: number[]): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.apiUrl}/buscar-tecnicos`, 
      { problemasIds }, 
      { headers: this.getHeaders() }
    );
  }

  confirmarPago(pagoData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/confirmar-pago`, 
      pagoData, 
      { headers: this.getHeaders() }
    );
  }
getSolicitudesPorTecnicoYEstado(tecnicoId: number, estado: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/tecnico/${tecnicoId}/estado/${estado}`);
    }

    cambiarEstadoSolicitud(solicitudId: number, nuevoEstado: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/${solicitudId}/estado/${nuevoEstado}`, {});
    }
  }

