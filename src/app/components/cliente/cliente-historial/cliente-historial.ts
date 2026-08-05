import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud.service';

@Component({
  selector: 'app-cliente-historial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-historial.html'
})
export class ClienteHistorial implements OnInit {
  solicitudes: any[] = [];
  
  private solicitudService = inject(SolicitudService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    // 1. Buscamos al usuario en el localStorage correctamente
    const usuarioString = localStorage.getItem('usuario'); 
    let clienteId = null; 
    
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      clienteId = usuario.clienteToken; 
    }

    // 2. Llamamos al servicio
    this.solicitudService.getHistorialCliente(clienteId).subscribe({
      next: (data) => {
        // Ordenamos para que las más recientes salgan arriba
        data.sort((a, b) => b.solicitudId - a.solicitudId);
        this.solicitudes = data;
        this.changeDetectorRef.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar el historial', err);
      }
    });
  }

  // --- NUEVO: Helper para dibujar las estrellas en el HTML ---
  getArrayEstrellas(calificacion: number): number[] {
    if (!calificacion || calificacion <= 0) return [];
    return Array(calificacion).fill(0); // Devuelve un array del tamaño de la calificación
  }
}