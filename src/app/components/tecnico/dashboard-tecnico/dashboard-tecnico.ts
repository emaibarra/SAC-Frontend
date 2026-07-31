import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service'; 
import { AuthService } from '../../../services/auth.service'; 
import { SolicitudService } from '../../../services/solicitud.service'; // <-- NUEVO

@Component({
  selector: 'app-dashboard-tecnico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-tecnico.html'
})
export class DashboardTecnicoComponent implements OnInit {

  private router = inject(Router);
  private tecnicoService = inject(TecnicoService); 
  private authService = inject(AuthService); 
  private solicitudService = inject(SolicitudService); // <-- NUEVO

  // Variable para guardar los datos reales del técnico
  miPerfil: any = null;
  // Variables para simular el estado del técnico
  estadoActual: string = 'DISPONIBLE';
  // Lo pasamos a FALSE por defecto para que inicie en la pantalla de "Esperando..."
  asistenciaActiva: boolean = false; 

  // NUEVO: Variables para manejar los datos de la BD
  solicitudesPendientes: any[] = [];
  solicitudActiva: any = null;

  // Al iniciar la pantalla, buscamos quién es el que ingresó
  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioActual();
    if (usuarioLogueado && usuarioLogueado.username) {
      this.tecnicoService.getPerfilPorUsername(usuarioLogueado.username).subscribe({
        next: (data) => {
          this.miPerfil = data;
          this.cargarSolicitudes(); // <-- NUEVO: Buscamos si hay encargos en la BD
        },
        error: (err) => console.error('Error al cargar mi perfil de técnico', err)
      });
    }
  }

  // NUEVO: Buscar las solicitudes sin romper tu lógica visual
  cargarSolicitudes(): void {
    if (!this.miPerfil) return;
    const idTecnico = this.miPerfil.tecnicoCodigo; 

    // 1. Buscar las que recién llegan
    this.solicitudService.getSolicitudesPorTecnicoYEstado(idTecnico, 'Pendiente')
      .subscribe(res => this.solicitudesPendientes = res);

    // 2. Buscar si ya estaba trabajando en una (por si recarga la página)
    this.solicitudService.getSolicitudesPorTecnicoYEstado(idTecnico, 'Aceptada')
      .subscribe(res => {
        if (res && res.length > 0) {
          this.solicitudActiva = res[0];
          this.asistenciaActiva = true; // Mostramos tu pantalla de asistencia
          this.estadoActual = 'OCUPADO';
        }
      });
  }

  // NUEVO: Botón para aceptar el encargo que entra
  aceptarEncargo(solicitud: any): void {
    this.solicitudService.cambiarEstadoSolicitud(solicitud.solicitudId, 'Aceptada').subscribe({
      next: () => {
        this.solicitudActiva = solicitud;
        this.asistenciaActiva = true; // Cambia tu interfaz a modo activo
        this.estadoActual = 'OCUPADO';
        this.cargarSolicitudes(); // Refresca las listas
      },
      error: (err) => alert('Error: ' + err.error?.error)
    });
  }

  // NUEVO: Botón para rechazar el encargo antes de tomarlo
  rechazarEncargo(solicitudId: number): void {
    if(confirm('¿Seguro que deseas rechazar este encargo?')) {
      this.solicitudService.cambiarEstadoSolicitud(solicitudId, 'Cancelada').subscribe({
        next: () => this.cargarSolicitudes(),
        error: (err) => alert('Error: ' + err.error?.error)
      });
    }
  }

  // NUEVO: Cancelar encargo ya aceptado
  cancelarEncargo(): void {
    if (confirm('¿Seguro que deseas cancelar este trabajo en curso?')) {
       if (this.solicitudActiva) {
         this.solicitudService.cambiarEstadoSolicitud(this.solicitudActiva.solicitudId, 'Cancelada').subscribe({
           next: () => {
             this.asistenciaActiva = false; // Vuelve a tu pantalla de inicio
             this.estadoActual = 'DISPONIBLE';
             this.solicitudActiva = null;
             alert('Encargo cancelado.');
             this.cargarSolicitudes();
           },
           error: (err) => alert('Error al cancelar: ' + err.error?.error)
         });
       }
    }
  }

  // MODIFICADO: Le agrega la petición a la BD a tu método original
  completarAsistencia(): void {
    if (confirm('¿Confirmas que la asistencia fue resuelta con éxito?')) {
      if (this.solicitudActiva) {
        this.solicitudService.cambiarEstadoSolicitud(this.solicitudActiva.solicitudId, 'Terminada').subscribe({
          next: () => {
            this.asistenciaActiva = false;
            this.estadoActual = 'DISPONIBLE'; // Vuelve a estar libre
            this.solicitudActiva = null;
            alert('¡Excelente trabajo! Volviste a estar Disponible.');
            this.cargarSolicitudes(); // Limpia la pantalla
          },
          error: (err) => alert('Error al concluir: ' + err.error?.error)
        });
      }
    }
  }

  cambiarEstado(nuevoEstado: string): void {
    this.estadoActual = nuevoEstado;
    // Aquí en el futuro avisaremos al backend que este técnico está ocupado o libre
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión? Dejarás de recibir alertas.')) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      this.router.navigate(['/login']);
    }
  }
}