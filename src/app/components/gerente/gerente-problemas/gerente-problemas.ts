import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProblemaService } from '../../../services/problema.service';
import { ListaPrecioService } from '../../../services/lista-precio';

@Component({
  selector: 'app-gerente-problemas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gerente-problemas.html'
})
export class GerenteProblemasComponent implements OnInit {
  problemas: any[] = [];
  listasPrecio: any[] = [];
  
  // Estructura espejo de la Entidad Java
  problemaActual = {
    problemaId: null as number | null,
    problemaNombre: '',
    problemaDescripcion: '',
    listaPrecio: {
      listaPrecioId: null as number | null
    }
  };

  modoEdicion = false;

  private problemaService = inject(ProblemaService);
  private listaPrecioService = inject(ListaPrecioService);

  ngOnInit(): void {
    this.cargarProblemas();
    this.cargarListasPrecio();
  }

  cargarProblemas(): void {
    this.problemaService.getProblemas().subscribe({
      next: (data) => this.problemas = data,
      error: (err) => console.error('Error al cargar problemas', err)
    });
  }

  cargarListasPrecio(): void {
    this.listaPrecioService.getListasPrecio().subscribe({
      next: (data) => this.listasPrecio = data,
      error: (err) => console.error('Error al cargar precios', err)
    });
  }

  guardarProblema(): void {
    if (this.modoEdicion && this.problemaActual.problemaId) {
      this.problemaService.actualizarProblema(this.problemaActual.problemaId, this.problemaActual).subscribe({
        next: () => {
          this.cargarProblemas();
          this.cancelarEdicion();
        },
        error: (err) => alert('Error al actualizar el problema')
      });
    } else {
      this.problemaService.crearProblema(this.problemaActual).subscribe({
        next: () => {
          this.cargarProblemas();
          this.cancelarEdicion();
        },
        error: (err) => alert('Error al guardar el problema')
      });
    }
  }

  editarProblema(problema: any): void {
    this.modoEdicion = true;
    this.problemaActual = {
      problemaId: problema.problemaId,
      problemaNombre: problema.problemaNombre,
      problemaDescripcion: problema.problemaDescripcion,
      listaPrecio: {
        listaPrecioId: problema.listaPrecio ? problema.listaPrecio.listaPrecioId : null
      }
    };
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.problemaActual = {
      problemaId: null,
      problemaNombre: '',
      problemaDescripcion: '',
      listaPrecio: { listaPrecioId: null }
    };
  }

  eliminarProblema(id: number): void {
    if (confirm('¿Estás seguro de eliminar este problema?')) {
      this.problemaService.eliminarProblema(id).subscribe({
        next: () => this.cargarProblemas(),
        error: (err) => alert('No se pudo eliminar.')
      });
    }
  }
}