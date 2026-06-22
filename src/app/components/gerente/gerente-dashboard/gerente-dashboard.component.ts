import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-gerente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gerente-dashboard.component.html'
})
export class DashboardGerenteComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);
  
  usuarioLogueado: any = null;

  ngOnInit(): void {
    // Recuperamos los datos del usuario logueado (que guardamos en el Login)
    this.usuarioLogueado = this.authService.getUsuarioActual();
  }

  // Función de ejemplo para los botones de reportes
  generarReporte(tipo: string): void {
    const empresaId = this.usuarioLogueado?.empresaId;
    if (!empresaId) {
      alert('Error: No se pudo identificar tu empresa.');
      return;
    }
    this.router.navigate(['/gerente/reportes'], { queryParams: { tipo: tipo } });
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('usuario');
      this.router.navigate(['/login']);
    }
  }
}