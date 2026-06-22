import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListaPrecioService } from '../../../services/lista-precio';

@Component({
  selector: 'app-gerente-lista-precios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gerente-lista-precios.html'
})
export class GerenteListaPreciosComponent implements OnInit {
  listas: any[] = [];
  
  listaActual = {
    listaPrecioId: null as number | null,
    nombre: '',
    descripcion: '',
    precio: null as number | null
  };

  modoEdicion = false;

  private listaPrecioService = inject(ListaPrecioService);

  ngOnInit(): void {
    this.cargarListas();
  }

  cargarListas(): void {
    this.listaPrecioService.getListasPrecio().subscribe({
      next: (data) => this.listas = data,
      error: (err) => console.error('Error al cargar la lista de precios', err)
    });
    
  }

  guardarLista(): void {
    if (this.modoEdicion && this.listaActual.listaPrecioId) {
      this.listaPrecioService.actualizarListaPrecio(this.listaActual.listaPrecioId, this.listaActual).subscribe({
        next: () => {
          this.cargarListas();
          this.cancelarEdicion();
        },
        error: (err) => alert('Error al actualizar el precio')
      });
    } else {
      this.listaPrecioService.crearListaPrecio(this.listaActual).subscribe({
        next: () => {
          this.cargarListas();
          this.cancelarEdicion();
        },
        error: (err) => alert('Error al guardar el precio')
      });
    }
  }

  editarLista(lista: any): void {
    this.modoEdicion = true;
    this.listaActual = { ...lista }; 
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.listaActual = { listaPrecioId: null, nombre: '', descripcion: '', precio: null };
  }

  eliminarLista(id: number): void {
    if (confirm('¿Estás seguro de eliminar este ítem de la lista?')) {
      this.listaPrecioService.eliminarListaPrecio(id).subscribe({
        next: () => this.cargarListas(),
        error: (err) => alert('No se pudo eliminar.')
      });
    }
  }
}