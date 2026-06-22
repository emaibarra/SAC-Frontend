import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service'; // <-- NUEVO
import { AuthService } from '../../../services/auth.service'; // <-- NUEVO
@Component({
  selector: 'app-dashboard-tecnico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-tecnico.html'
})
export class DashboardTecnicoComponent {

  private router = inject(Router);
 private tecnicoService = inject(TecnicoService); // <-- NUEVO
  private authService = inject(AuthService); // <-- NUEVO
  
  // NUEVO: Variable para guardar los datos reales del técnico
  miPerfil: any = null;
  // Variables para simular el estado del técnico
  estadoActual: string = 'DISPONIBLE';
  // Lo pasamos a FALSE por defecto para que inicie en la pantalla de "Esperando..."
  asistenciaActiva: boolean = false; 

  // NUEVO: Al iniciar la pantalla, buscamos quién es el que ingresó
  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioActual();
    if (usuarioLogueado && usuarioLogueado.username) {
      this.tecnicoService.getPerfilPorUsername(usuarioLogueado.username).subscribe({
        next: (data) => {
          this.miPerfil = data;
        },
        error: (err) => console.error('Error al cargar mi perfil de técnico', err)
      });
    }}
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