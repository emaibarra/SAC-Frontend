import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZonaEmpresaService } from '../../../services/zona-empresa';
import { ZonaService } from '../../../services/zona.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-gerente-zonas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gerente-zonas.html'
})
export class GerenteZonasComponent implements OnInit {
  
  zonasGlobales: any[] = [];
  misZonasEmpresa: any[] = [];
  
  nuevaZonaEmpresa = {
    zonaEmpresaNombre: '',
    precioPorKm: null as number | null, 
    empresa: { empresaId: null as number | null },
    zona: { zonaId: null as number | null }
  };

  private zonaEmpresaService = inject(ZonaEmpresaService);
  private zonaService = inject(ZonaService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    if (usuario && usuario.empresaId) {
      this.nuevaZonaEmpresa.empresa.empresaId = usuario.empresaId;
      this.cargarZonasGlobales();
      this.cargarMisZonas();
    } else {
      alert('Error al identificar tu empresa. Inicia sesión nuevamente.');
    }
  }

  cargarZonasGlobales(): void {
    this.zonaService.getZonas().subscribe({
      next: (data) => this.zonasGlobales = data,
      error: (err) => console.error('Error al cargar zonas globales', err)
    });
  }

  cargarMisZonas(): void {
    if (this.nuevaZonaEmpresa.empresa.empresaId) {
      this.zonaEmpresaService.getZonasPorEmpresa(this.nuevaZonaEmpresa.empresa.empresaId).subscribe({
        next: (data) => this.misZonasEmpresa = data,
        error: (err) => console.error('Error al cargar mis zonas', err)
      });
    }
  }

  guardarZonaEmpresa(): void {
    if (!this.nuevaZonaEmpresa.zona.zonaId || !this.nuevaZonaEmpresa.zonaEmpresaNombre) {
      alert('Completa todos los campos');
      return;
    }

    this.zonaEmpresaService.crearZonaEmpresa(this.nuevaZonaEmpresa).subscribe({
      next: () => {
        alert('Zona vinculada con éxito a tu empresa.');
        this.cargarMisZonas();
        this.nuevaZonaEmpresa.zonaEmpresaNombre = '';
        this.nuevaZonaEmpresa.precioPorKm = null;
        this.nuevaZonaEmpresa.zona.zonaId = null;
      },
      error: (err) => alert('Error al guardar: ' + err.message)
    });
  }

  eliminarZonaEmpresa(id: number): void {
    if (confirm('¿Eliminar esta zona de tu empresa?')) {
      this.zonaEmpresaService.eliminarZonaEmpresa(id).subscribe({
        next: () => this.cargarMisZonas(),
        error: (err) => alert('Error al eliminar. Puede que haya técnicos asignados a esta zona.')
      });
    }
  }
}