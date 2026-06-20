import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EmpresaService } from './services/empresa.service';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  empresas: any[] = [];
  nuevaEmpresa: any = { empresaNombre: '', empresaTelefono: '', empresaCUIL: '', empresaDireccion: '' };

  credenciales = { username: '', password: '' };
  errorLogin: string = '';
  
  // NUEVA VARIABLE PARA CONTROLAR LA PANTALLA
  rolActual: string | null = ''; 

  private empresaService = inject(EmpresaService);
  public authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.estaLogueado()) {
      // Si recargamos la página y hay sesión, leemos el rol guardado
      this.rolActual = this.authService.getRol(); 
      if (this.rolActual === 'ADMINISTRADOR') {
        this.cargarEmpresas();
      }
    }
  }

  iniciarSesion(): void {
    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
        // --- LA LUPA DE DETECTIVE ---
        console.log('Respuesta cruda del backend:', res); 
        
        // Actualizamos la variable al instante para forzar el cambio en el HTML
        this.rolActual = res.rol; 
        this.errorLogin = '';

        // Solo cargamos empresas si es admin
        if (this.rolActual === 'ADMINISTRADOR') {
          this.cargarEmpresas(); 
        }
      },
      error: (err: any) => {
        this.errorLogin = 'Usuario o contraseña incorrectos';
        console.error('Error de login', err);
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.rolActual = ''; // Vaciamos la variable al salir
    this.empresas = []; 
    this.credenciales = { username: '', password: '' };
  }

  cargarEmpresas(): void {
    this.empresaService.getEmpresas().subscribe({
      next: (data: any[]) => this.empresas = data,
      error: (err: any) => console.error('Error al cargar empresas', err)
    });
  }

  guardarEmpresa(): void {
    this.empresaService.crearEmpresa(this.nuevaEmpresa).subscribe({
      next: (respuesta: any) => {
        this.cargarEmpresas(); 
        this.nuevaEmpresa = { empresaNombre: '', empresaTelefono: '', empresaCUIL: '', empresaDireccion: '' };
      },
      error: (err: any) => console.error('Error al guardar la empresa', err)
    });
  }
}