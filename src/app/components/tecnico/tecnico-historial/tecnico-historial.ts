import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // 👈 1. Importamos RouterModule
import { AuthService } from '../../../services/auth.service';
import { TecnicoService } from '../../../services/tecnico.service';

@Component({
  selector: 'app-tecnico-historial',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 2. Lo agregamos aquí
  templateUrl: './tecnico-historial.html'
})
export class TecnicoHistorialComponent implements OnInit {
  
  historial: any[] = [];
  cargando: boolean = true;

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private tecnicoService = inject(TecnicoService); // <-- Lo inyectamos aquí
  private cdr = inject(ChangeDetectorRef);
  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioActual();
    
    // 1. Verificamos si hay un usuario con username
    if (usuarioLogueado && usuarioLogueado.username) {
      
      // 2. Buscamos su perfil completo en la BD (igual que en el dashboard)
      this.tecnicoService.getPerfilPorUsername(usuarioLogueado.username).subscribe({
        next: (perfil) => {
          const idDelTecnico = perfil.tecnicoCodigo;
          
          if (idDelTecnico) {
            // 3. Ahora sí, con el ID correcto, buscamos el historial
            this.cargarHistorial(idDelTecnico);
          } else {
            console.error('El perfil obtenido no tiene un tecnicoCodigo.');
            this.cargando = false;
            this.cdr.detectChanges(); // Forzamos la detección de cambios después de actualizar el estado
          }
          },
        error: (err) => {
          console.error('Error al obtener el perfil del técnico', err);
          this.cargando = false;
          this.cdr.detectChanges(); // Forzamos la detección de cambios después de actualizar el estado
        }
      });
      
    } else {
      console.error('No se pudo obtener el username del usuario logueado.');
      this.cargando = false;
      this.cdr.detectChanges(); // Forzamos la detección de cambios después de actualizar el estado
    }
  }

  cargarHistorial(tecnicoId: number): void {
    this.http.get<any[]>(`http://localhost:8080/api/solicitudes/historial/tecnico/${tecnicoId}`)
      .subscribe({
        next: (datos) => {
          this.historial = datos;
          this.cargando = false;
          this.cdr.detectChanges(); // Forzamos la detección de cambios después de actualizar el estado
        },
        error: (err) => {
          console.error('Error al cargar el historial', err);
          this.cargando = false;
          this.cdr.detectChanges(); // Forzamos la detección de cambios después de actualizar el estado
        }
      });
  }
}