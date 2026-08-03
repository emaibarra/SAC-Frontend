import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud.service';

@Component({
  selector: 'app-cliente-historial',
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
    // 1. Buscamos al usuario en el localStorage (como hiciste en el botón de cerrar sesión)
    const usuarioString = localStorage.getItem('clienteToken'); // Asegúrate de que este sea el nombre correcto de la clave
    let clienteId = 1; // Dejamos el 1 de respaldo

    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      // 👇 REVISA ESTO: Pon el nombre exacto de la variable de tu ID (puede ser id, clienteToken, etc.)
      clienteId = usuario.clienteToken || usuario.id || 1; 
    }

    // 2. Llamamos al servicio con el ID real
    this.solicitudService.getHistorialCliente(clienteId).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.changeDetectorRef.detectChanges(); // Forzamos la detección de cambios
        console.log("Historial recibido:", data); // Agregamos un log para espiar qué llega
      },
      error: (err) => {
        console.error('Error al cargar el historial', err);
      }
    });
  }
}