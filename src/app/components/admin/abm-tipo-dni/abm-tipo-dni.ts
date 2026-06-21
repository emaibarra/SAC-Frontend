import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TipoDniService } from './../../../services/tipo-dni.service';

@Component({
  selector: 'app-abm-tipo-dni',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './abm-tipo-dni.html'
})
export class AbmTipoDniComponent implements OnInit {
  tiposDni: any[] = [];
  // Asegúrate de que el nombre del campo coincida con la propiedad en tu backend (TipodniNombre o tipodniNombre)
  nuevaTipoDni: any = { tipodniNombre: '' }; 

  private tipoDniService = inject(TipoDniService);

  ngOnInit(): void {
    this.cargarTiposDni();
  }

  cargarTiposDni(): void {
    this.tipoDniService.getTiposDni().subscribe({
      next: (data) => this.tiposDni = data,
      error: (err) => console.error('Error al cargar tipos de DNI', err)
    });
  }

  guardarTipoDni(): void {
    this.tipoDniService.crearTipoDni(this.nuevaTipoDni).subscribe({
      next: () => {
        this.cargarTiposDni();
        this.nuevaTipoDni = { tipodniNombre: '' };
      },
      error: (err) => alert('Error al guardar el Tipo de DNI.')
    });
  }

  eliminarTipoDni(id: number): void {
    if (confirm('¿Estás seguro de eliminar este Tipo de Documento?')) {
      this.tipoDniService.eliminarTipoDni(id).subscribe({
        next: () => this.cargarTiposDni(),
        error: (err) => alert('Error al eliminar. Posiblemente esté en uso por un técnico.')
      });
    }
  }
}