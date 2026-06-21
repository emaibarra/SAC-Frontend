import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  // Esta es la URL de tu backend en Spring Boot.
  // Asegúrate de que el puerto coincida con el que usa tu API (usualmente 8080)
  private apiUrl = 'http://localhost:8080/api/tecnicos';

  constructor(private http: HttpClient) { }

  /**
   * Método para enviar el nuevo técnico al backend
   * @param tecnicoData Los datos del formulario unidos al empresaId
   * @returns Un Observable con la respuesta del servidor
   */
  crearTecnico(tecnicoData: any): Observable<any> {
    // Realiza una petición POST enviando el JSON al backend
    return this.http.post(this.apiUrl, tecnicoData);
  }
}