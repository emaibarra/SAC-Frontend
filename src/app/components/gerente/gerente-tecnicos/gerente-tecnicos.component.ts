import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-gerente-tecnicos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gerente-tecnicos.component.html'
})
export class GerenteTecnicosComponent implements OnInit {
  
  tecnicos: any[] = [];
  
  nuevoTecnico = {
    tecnicoNombre: '',
    tecnicoDNI: null,
    tecnicoCBU: null,
    tecnicoEmail: '',
    tecnicoDireccion: '',
    usuarioNombre: '',      
    usuarioPassword: '',    
    empresaId: null as number | null,
    zonaEmpresaId: null as number | null
  };

  private tecnicoService = inject(TecnicoService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioActual(); 
    if (usuarioLogueado && usuarioLogueado.empresaId) {
      this.nuevoTecnico.empresaId = usuarioLogueado.empresaId;
      this.cargarTecnicos();
    } else {
      alert('Error: No se pudo identificar tu empresa. Inicia sesión nuevamente.');
    }
  }

  cargarTecnicos(): void {
    // Obtenemos todos los técnicos y filtramos para mostrar solo los de la empresa actual
    this.tecnicoService.getTecnicos().subscribe({
      next: (data: any[]) => {
        this.tecnicos = data.filter(t => t.empresa?.empresaId === this.nuevoTecnico.empresaId);
      },
      error: (err: any) => console.error('Error al cargar técnicos', err)
    });
  }

  guardarTecnico(): void {
    if (!this.nuevoTecnico.empresaId || !this.nuevoTecnico.zonaEmpresaId) {
      alert('Error: Asegúrate de completar todos los campos, incluyendo la Zona.');
      return;
    }

    // 1. Armamos el payload con la estructura EXACTA que espera TecnicoRegistroDTO en Java
    const payload = {
      username: this.nuevoTecnico.usuarioNombre,
      password: this.nuevoTecnico.usuarioPassword,
      rolId: 3, // IMPORTANTE: Asegúrate de que el ID 3 corresponda al Rol "TECNICO" en tu base de datos
      empresaId: this.nuevoTecnico.empresaId,
      zonaEmpresaId: this.nuevoTecnico.zonaEmpresaId,
      tecnico: {
        tecnicoNombre: this.nuevoTecnico.tecnicoNombre,
        tecnicoDNI: this.nuevoTecnico.tecnicoDNI,
        tecnicoCBU: this.nuevoTecnico.tecnicoCBU,
        tecnicoEmail: this.nuevoTecnico.tecnicoEmail,
        tecnicoDireccion: this.nuevoTecnico.tecnicoDireccion
      }
    };

    // 2. Enviamos el payload estructurado, NO this.nuevoTecnico directamente
    this.tecnicoService.crearTecnico(payload).subscribe({
      next: () => {
        alert('Técnico guardado exitosamente');
        this.cargarTecnicos(); // Recargamos la lista
        
        // 3. Reseteamos el formulario correctamente
        this.nuevoTecnico = { 
          tecnicoNombre: '', tecnicoDNI: null, tecnicoCBU: null, 
          tecnicoEmail: '', tecnicoDireccion: '', 
          usuarioNombre: '', usuarioPassword: '', 
          empresaId: this.nuevoTecnico.empresaId,
          zonaEmpresaId: null // Se resetea correctamente a null
        };
      },
      error: (err: any) => {
        console.error('Error al crear técnico', err);
        alert('Hubo un error al guardar. Revisa los datos o la consola.');
      }
    });
  }

  eliminarTecnico(id: number): void {
    if (confirm('¿Estás seguro de eliminar este técnico?')) {
      this.tecnicoService.eliminarTecnico(id).subscribe({
        next: () => this.cargarTecnicos(),
        error: (err: any) => alert('Error al eliminar el técnico.')
      });
    }
  }
}