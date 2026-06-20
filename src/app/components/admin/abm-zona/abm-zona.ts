import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZonaService } from '../../../services/zona.service';
import { ProvinciaService } from '../../../services/provincia.service';

@Component({
  selector: 'app-abm-zona',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './abm-zona.html'
})
export class AbmZonaComponent implements OnInit {

  zonas: any[] = [];
  provincias: any[] = []; // Para llenar el <select>
  
  // Objeto preparado para la relación
  nuevaZona: any = { 
    zonaNombre: '', 
    zonaDescripcion: '', 
    provincia: { provinciaId: null } 
  };

  private zonaService = inject(ZonaService);
  private provinciaService = inject(ProvinciaService);

  ngOnInit(): void {
    this.cargarProvincias();
    this.cargarZonas();
  }

  cargarProvincias(): void {
    this.provinciaService.getProvincias().subscribe({
      next: (data) => this.provincias = data,
      error: (err) => console.error('Error al cargar provincias', err)
    });
  }

  cargarZonas(): void {
    this.zonaService.getZonas().subscribe({
      next: (data) => this.zonas = data,
      error: (err) => console.error('Error al cargar zonas', err)
    });
  }

  guardarZona(): void {
    if (!this.nuevaZona.provincia.provinciaId) {
      alert('Por favor, selecciona una provincia.');
      return;
    }

    this.zonaService.crearZona(this.nuevaZona).subscribe({
      next: () => {
        this.cargarZonas();
        // Limpiamos el formulario
        this.nuevaZona = { zonaNombre: '', zonaDescripcion: '', provincia: { provinciaId: null } }; 
      },
      error: (err) => {
        console.error('Error al guardar', err);
        alert('Error al guardar la zona.');
      }
    });
  }

  eliminarZona(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta zona?')) {
      this.zonaService.eliminarZona(id).subscribe({
        next: () => this.cargarZonas(),
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Hubo un error al eliminar la zona.');
        }
      });
    }
  }
}