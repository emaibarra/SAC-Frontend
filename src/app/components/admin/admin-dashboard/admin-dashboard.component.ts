import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule], // ¡Fundamental para que el HTML entienda los botones "routerLink"!
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  
  // La clase queda vacía por ahora. 
  // Al ser un menú principal, no necesitamos inyectar servicios 
  // ni cargar listas de datos al iniciar la pantalla.

}