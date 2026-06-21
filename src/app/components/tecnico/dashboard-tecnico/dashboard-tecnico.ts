import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-tecnico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-tecnico.html'
})
export class DashboardTecnicoComponent {

  private router = inject(Router);

  // Variables para simular el estado del técnico
  estadoActual: string = 'DISPONIBLE';
  
  // Simulamos que le entra una alerta de un ciclista (en el futuro esto vendrá del Backend)
  asistenciaActiva: boolean = true; 

  cambiarEstado(nuevoEstado: string): void {
    this.estadoActual = nuevoEstado;
    // Aquí en el futuro avisaremos al backend que este técnico está ocupado o libre
  }

  completarAsistencia(): void {
    if (confirm('¿Confirmas que la asistencia fue resuelta con éxito?')) {
      this.asistenciaActiva = false;
      this.estadoActual = 'DISPONIBLE'; // Vuelve a estar libre
      alert('¡Excelente trabajo! Volviste a estar Disponible.');
    }
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión? Dejarás de recibir alertas.')) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      this.router.navigate(['/login']);
    }
  }
}