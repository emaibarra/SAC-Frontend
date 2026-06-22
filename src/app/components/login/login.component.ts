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
// NUEVO: Guardamos los datos del usuario para poder usarlos en los Dashboards
        localStorage.setItem('usuario', JSON.stringify({ 
          username: respuesta.username, 
          empresaId: respuesta.empresaId 
        }));
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
  // ========================================================
  // 2. NUEVA LÓGICA AGREGADA PARA EL CLIENTE
  // ========================================================
  
  mostrarLoginCliente: boolean = false; // Controla qué pantalla se ve
  telefonoCliente: string = '';

  irAPantallaCliente(): void {
    this.mostrarLoginCliente = true;
    this.errorLogin = ''; // Limpiamos errores al cambiar de pantalla
  }

  volverAPantallaNormal(): void {
    this.mostrarLoginCliente = false;
    this.errorLogin = '';
  }

  iniciarSesionClienteTelefono(): void {
    if (!this.telefonoCliente) {
      this.errorLogin = 'Por favor ingrese un número de teléfono';
      return;
    }
    
    // Asume que agregaste el método loginCliente en auth.service.ts
    const payload = { metodo: 'TELEFONO', telefono: this.telefonoCliente };
    this.authService.loginCliente(payload).subscribe({
      next: (respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.rol);
        // Redirigir al dashboard del cliente
        this.router.navigate(['/cliente/dashboard']);
      },
      error: (error) => {
        console.error('Error de login cliente', error);
        this.errorLogin = 'Error al iniciar sesión con teléfono';
      }
    });
  }

  iniciarSesionClienteGoogle(): void {
    // Datos simulados para Google
    const payload = { 
      metodo: 'GOOGLE', 
      email: 'cliente@gmail.com', 
      nombre: 'Juan Perez' 
    };
    this.authService.loginCliente(payload).subscribe({
      next: (respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.rol);
        this.router.navigate(['/cliente/dashboard']);
      },
      error: (error) => {
        console.error('Error de login cliente Google', error);
        this.errorLogin = 'Servicio de Google no disponible';
      }
    });
  }
}