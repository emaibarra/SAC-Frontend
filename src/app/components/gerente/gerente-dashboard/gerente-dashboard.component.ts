import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-gerente-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gerente-dashboard.component.html',
  styleUrls: ['./gerente-dashboard.component.css'] // Si tienes estilos específicos
})
export class GerenteDashboardComponent {
  
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  cerrarSesion(): void {
    // Llama al método de tu servicio que limpia el token o el estado de sesión
    this.authService.logout(); 
    // Redirige a la pantalla de inicio de sesión
    this.router.navigate(['/login']); 
  }
}