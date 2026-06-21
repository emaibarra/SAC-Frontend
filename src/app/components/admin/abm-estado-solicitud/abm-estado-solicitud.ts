import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstadoSolicitudService } from '../../../services/estado-solicitud.service';

@Component({
  selector: 'app-abm-estado-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './abm-estado-solicitud.html'
})
export class AbmEstadoSolicitudComponent implements OnInit {

  estados: any[] = [];
  nuevoEstado: any = { estadoNombre: '', estadoDescripcion: '' };

  private estadoService = inject(EstadoSolicitudService);

  ngOnInit(): void {
    this.cargarEstados();
  }

  cargarEstados(): void {
    this.estadoService.getEstados().subscribe({
      next: (data) => this.estados = data,
      error: (err) => console.error('Error al cargar los estados', err)
    });
  }

  guardarEstado(): void {
    this.estadoService.crearEstado(this.nuevoEstado).subscribe({
      next: () => {
        this.cargarEstados();
        this.nuevoEstado = { estadoNombre: '', estadoDescripcion: '' }; // Limpiamos
      },
      error: (err) => {
        console.error('Error al guardar', err);
        alert('Error al guardar el estado. Revisa la consola.');
      }
    });
  }

  eliminarEstado(id: number): void {
    if (confirm('¿Estás seguro de eliminar este estado? Si hay solicitudes usándolo, podría causar problemas.')) {
      this.estadoService.eliminarEstado(id).subscribe({
        next: () => this.cargarEstados(),
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Hubo un error al eliminar. Tal vez el estado ya está asignado a una solicitud.');
        }
      });
    }
  }
}