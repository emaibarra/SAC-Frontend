import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud.service';

@Component({
  selector: 'app-cliente-reclamo',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-reclamo.html'
})
export class ClienteReclamo implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private solicitudService = inject(SolicitudService);

  // Lista de solicitudes del cliente para elegir en el select
  misSolicitudes: any[] = [];

  // Datos que coinciden exactamente con lo que guardas en tu base de datos
  reclamo = {
    descripcion: '',
    solicitudId: null as number | null
  };

  ngOnInit(): void {
    this.cargarSolicitudesCliente();
  }

  cargarSolicitudesCliente(): void {
    const usuarioString = localStorage.getItem('usuario');
    let clienteId = 1;

    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      clienteId = usuario.clienteToken || usuario.id || 1;
    }

    // Traemos el historial para que el usuario elija sobre qué viaje reclama
    this.solicitudService.getHistorialCliente(clienteId).subscribe({
      next: (data) => {
        this.misSolicitudes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las solicitudes', err);
      }
    });
  }

  enviarReclamo(): void {
    if (!this.reclamo.solicitudId) {
      alert('Por favor, seleccioná la solicitud sobre la cual querés hacer el reclamo.');
      return;
    }
    if (!this.reclamo.descripcion.trim()) {
      alert('Por favor, escribí una descripción del problema.');
      return;
    }
this.solicitudService.guardarReclamo(this.reclamo).subscribe({
      next: (response) => {
        this.reclamo.descripcion = '';
        this.reclamo.solicitudId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar el reclamo', err);
        alert('Hubo un error al registrar el reclamo.');
      }
    });
  
    // Aquí llamarías a tu servicio de reclamos enviando: 
    // { descripcion: this.reclamo.descripcion, solicitudId: this.reclamo.solicitudId }
    
    console.log("Guardando en BD:", this.reclamo);
    alert('¡Problema informado con éxito!');

    // Limpiamos
    this.reclamo.descripcion = '';
    this.reclamo.solicitudId = null;
    this.cdr.detectChanges();
  }
}