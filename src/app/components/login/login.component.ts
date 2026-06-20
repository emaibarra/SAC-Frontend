import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  
  // 1. Variables exclusivas del Login
  credenciales = { username: '', password: '' };
  errorLogin: string = ''; 

  // 2. Inyectamos los servicios (Acá está el fix del Router)
  public authService = inject(AuthService);
  private router = inject(Router);

  // 3. Única función del componente: Loguearse y navegar
  iniciarSesion(): void {
    this.authService.login(this.credenciales).subscribe({
      next: (respuesta) => {
        console.log('Login exitoso:', respuesta);
        
        // Guardamos las credenciales
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.rol); 

        const rolAsignado = respuesta.rol.toUpperCase(); // Aseguramos que esté en mayúsculas por si acaso

        if (rolAsignado === 'ADMINISTRADOR') {
          this.router.navigate(['/admin']); // Ruta hacia el dashboard del admin
        } 
        else if (rolAsignado === 'GERENTE' || rolAsignado === 'EMPRESA') {
          this.router.navigate(['/gerente/dashboard']); // Ruta hacia el dashboard de la empresa
        } 
        else if (rolAsignado === 'TECNICO') {
          this.router.navigate(['/tecnico/dashboard']); // Ruta hacia el dashboard del técnico
        } 
        else {
          // Si el rol es "CLIENTE" o cualquier otro que no esté mapeado arriba, lo enviamos al inicio
          this.router.navigate(['/home']); 
        }
      },
      error: (error) => {
        console.error('Error de login', error);
        // Fix de la variable de error
        this.errorLogin = 'Credenciales incorrectas o acceso no autorizado';
      }
    });
  }
}