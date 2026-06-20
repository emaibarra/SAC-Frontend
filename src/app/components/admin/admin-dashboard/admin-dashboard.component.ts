import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- Importante: Router y RouterModule

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // <-- RouterModule es necesario para que funcionen los routerLink
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css' // (Podés borrar esta línea si no tenés el archivo CSS)
})
export class AdminDashboardComponent {

  private router = inject(Router);

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      // Limpiamos los datos del usuario en el navegador
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      
      // Lo mandamos de vuelta al Login
      this.router.navigate(['/login']);
    }
  }

}