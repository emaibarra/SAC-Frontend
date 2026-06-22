import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service';
import { AuthService } from '../../../services/auth.service';
import { ZonaEmpresaService } from '../../../services/zona-empresa';
import { TipoDniService } from '../../../services/tipo-dni.service';
@Component({
  selector: 'app-gerente-tecnicos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gerente-tecnicos.component.html'
})
export class GerenteTecnicosComponent implements OnInit {
  
  tecnicos: any[] = [];
  zonasEmpresa: any[] = [];
  tiposDni: any[] = [];
  nuevoTecnico = {
    tecnicoNombre: '',
    tecnicoDNI: null,
    tecnicoCBU: '',
    tecnicoEmail: '',
    tecnicoDireccion: '',
    usuarioNombre: '',      
    usuarioPassword: '',    
    empresaId: null as number | null,
    zonaEmpresaId: null as number | null,
    tipoDniId: null as number | null // NUEVO CAMPO PARA EL TIPO DE DNI
  };

  private tecnicoService = inject(TecnicoService);
  private authService = inject(AuthService);
  private zonaEmpresaService = inject(ZonaEmpresaService);
  private tipoDniService = inject(TipoDniService);
  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioActual(); 
    if (usuarioLogueado && usuarioLogueado.empresaId) {
      this.nuevoTecnico.empresaId = usuarioLogueado.empresaId;
      this.cargarTecnicos();
      this.cargarZonasEmpresa(); // Cargamos las zonas de la empresa para el dropdown
      this.cargarTiposDni(); // Cargamos los tipos de DNI para el dropdown
    } else {
      alert('Error: No se pudo identificar tu empresa. Inicia sesión nuevamente.');
    }
  }
  cargarTiposDni(): void {
    this.tipoDniService.getTiposDni().subscribe({
      next: (data: any[]) => {
        this.tiposDni = data;
        console.log('Tipos de DNI cargados:', this.tiposDni);
      },
      error: (err: any) => console.error('Error al cargar tipos de DNI', err)
    });
  }
  cargarZonasEmpresa(): void {
    if (this.nuevoTecnico.empresaId) {
      // Usamos el servicio de ZonaEmpresa, filtrando por el ID de la empresa
      this.zonaEmpresaService.getZonasPorEmpresa(this.nuevoTecnico.empresaId).subscribe({
        next: (data: any[]) => {
          this.zonasEmpresa = data;
          console.log('Zonas cargadas:', this.zonasEmpresa); // Útil para depurar en la consola (F12)
        },
        error: (err: any) => console.error('Error al cargar zonas de empresa', err)
      });
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
      tipoDniId: this.nuevoTecnico.tipoDniId, // NUEVO CAMPO PARA EL TIPO DE DNI
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
          tecnicoNombre: '', tecnicoDNI: null, tecnicoCBU: '', 
          tecnicoEmail: '', tecnicoDireccion: '', 
          usuarioNombre: '', usuarioPassword: '', 
          empresaId: this.nuevoTecnico.empresaId,
          zonaEmpresaId: null ,// Se resetea correctamente a null
          tipoDniId: null, // Reseteamos el tipo de DNI también
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