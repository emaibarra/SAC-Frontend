import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service';
import { AuthService } from '../../../services/auth.service';
import { ZonaService } from '../../../services/zona.service';
@Component({
  selector: 'app-gerente-tecnicos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gerente-tecnicos.component.html'
})
export class GerenteTecnicosComponent implements OnInit {
  
  tecnicos: any[] = [];
  zonasEmpresa: any[] = []; // Nueva lista para el select
  
  nuevoTecnico = {
    tecnicoNombre: '',
    tecnicoDNI: null,
    tecnicoCBU: null,
    tecnicoEmail: '',
    tecnicoDireccion: '',
    usuarioNombre: '',      
    usuarioPassword: '',    
    empresaId: null as number | null,
    zonaEmpresaId: null as number | null // Nuevo campo para el formulario
  };

  private tecnicoService = inject(TecnicoService);
  private authService = inject(AuthService);
 private zonaService = inject(ZonaService); // Inyectar servicio de zonas

  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioActual(); 
    if (usuarioLogueado && usuarioLogueado.empresaId) {
      this.nuevoTecnico.empresaId = usuarioLogueado.empresaId;
      this.cargarTecnicos();
       this.cargarZonas(); // Cargar las zonas al iniciar
    } else {
      alert('Error: No se pudo identificar tu empresa. Inicia sesión nuevamente.');
    }
  }
cargarZonas(): void {
    // Ajusta este método según tu API de Zonas
    this.zonaService.getZonas().subscribe(data => {
      this.zonasEmpresa = data;
    });
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
    if (!this.nuevoTecnico.empresaId) {
      alert('Error: No se pudo identificar la empresa del gerente.');
      return;
    }

    this.tecnicoService.crearTecnico(this.nuevoTecnico).subscribe({
      next: () => {
        alert('Técnico guardado exitosamente');
        this.cargarTecnicos(); // Recargamos la lista
        
        // Reseteamos el formulario manteniendo el ID de la empresa
        this.nuevoTecnico = { 
          tecnicoNombre: '', tecnicoDNI: null, tecnicoCBU: null, 
          tecnicoEmail: '', tecnicoDireccion: '', 
          usuarioNombre: '', usuarioPassword: '', 
          empresaId: this.nuevoTecnico.empresaId,
         zonaEmpresaId : { zonaEmpresaId: this.nuevoTecnico.zonaEmpresaId },
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