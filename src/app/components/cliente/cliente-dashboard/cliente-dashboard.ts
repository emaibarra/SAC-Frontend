import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-dashboard',
  imports: [RouterLink],
  templateUrl: './cliente-dashboard.html',
  styleUrl: './cliente-dashboard.css',
})
export class ClienteDashboard {
private router = inject(Router);

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('usuario'); // Por si guardás datos extra
      this.router.navigate(['/login']);
    }
  }
}
