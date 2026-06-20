import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProvinciaService } from '../../../services/provincia.service';

@Component({
  selector: 'app-abm-provincia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './abm-provincia.html',
  styleUrl: './abm-provincia.component.css'
})
export class AbmProvinciaComponent implements OnInit {

  provincias: any[] = [];
  nuevaProvincia: any = { provinciaNombre: '' };

  private provinciaService = inject(ProvinciaService);

  ngOnInit(): void {
    this.cargarProvincias();
  }

  cargarProvincias(): void {
    this.provinciaService.getProvincias().subscribe({
      next: (data) => this.provincias = data,
      error: (err) => console.error('Error al cargar provincias', err)
    });
  }

  guardarProvincia(): void {
    this.provinciaService.crearProvincia(this.nuevaProvincia).subscribe({
      next: () => {
        this.cargarProvincias();
        this.nuevaProvincia = { provinciaNombre: '' }; // Limpia el input
      },
      error: (err) => {
        console.error('Error al guardar la provincia', err);
        alert('Error al guardar la provincia.');
      }
    });
  }

  eliminarProvincia(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta provincia?')) {
      this.provinciaService.eliminarProvincia(id).subscribe({
        next: () => this.cargarProvincias(),
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('No se puede eliminar la provincia porque probablemente esté siendo utilizada por otras entidades (como Zonas).');
        }
      });
    }
  }
}