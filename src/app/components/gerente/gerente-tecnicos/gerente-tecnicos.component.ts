import { Component, OnInit } from '@angular/core';
import { TecnicoService } from '../../../services/tecnico.service';
import { AuthService } from '../../../services/auth.service'; // Para obtener los datos del gerente logueado

@Component({
  selector: 'app-gerente-tecnicos',
  templateUrl: './gerente-tecnicos.component.html',
  styleUrls: ['./gerente-tecnicos.component.css']
})
export class GerenteTecnicosComponent implements OnInit {
  
  nuevoTecnico = {
    tecnicoNombre: '',
    tecnicoDNI: null,
    tecnicoCBU: null,
    tecnicoEmail: '',
    tecnicoDireccion: '',
    usuarioNombre: '',      // NUEVO
    usuarioPassword: '',    // NUEVO
    empresaId: null as number | null
  };

  constructor(
    private tecnicoService: TecnicoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioActual(); 
    if (usuarioLogueado && usuarioLogueado.empresaId) {
      this.nuevoTecnico.empresaId = usuarioLogueado.empresaId;
    }
  }

  guardarTecnico() {
    if (!this.nuevoTecnico.empresaId) {
      alert('Error: No se pudo identificar la empresa del gerente.');
      return;
    }

    this.tecnicoService.crearTecnico(this.nuevoTecnico).subscribe({
      next: () => {
        alert('Técnico y Usuario creados exitosamente');
        // Reseteamos el formulario manteniendo el ID de la empresa
        this.nuevoTecnico = { 
          tecnicoNombre: '', tecnicoDNI: null, tecnicoCBU: null, 
          tecnicoEmail: '', tecnicoDireccion: '', 
          usuarioNombre: '', usuarioPassword: '', 
          empresaId: this.nuevoTecnico.empresaId 
        };
      },
      error: (err) => {
        console.error('Error al crear técnico', err);
        alert('Hubo un error: ' + (err.error || 'Revisa los datos'));
      }
    });
  }
}