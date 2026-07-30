import { Component, OnInit, inject } from '@angular/core';
import { SolicitudService } from '../../../services/solicitud.service';
import { ProblemaService } from '../../../services/problema.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitar-tecnico',
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-tecnico.html',
  styleUrl: './solicitar-tecnico.css',
})
export class SolicitarTecnico {
  pasoActual: number = 1; 
  
  problemasDisponibles: any[] = []; 
  problemasSeleccionados: number[] = [];
  
  tecnicosDisponibles: any[] = [];
  tecnicoElegido: any = null;

  datosPago = {
    metodoPago: 'EFECTIVO',
    nroTarjeta: null as number | null,
    codSeguridadTarjeta: null as number | null,
    fechaVencTarjeta: ''
  };

  // Usando inyección moderna tal como hiciste en tu servicio
  private solicitudService = inject(SolicitudService);
  private problemaService = inject(ProblemaService);

  ngOnInit(): void {
    this.cargarProblemas();
  }

  cargarProblemas(): void {
    this.problemaService.getProblemas().subscribe({
      next: (data) => {
        this.problemasDisponibles = data;
      },
      error: (err) => {
        console.error('Error al cargar los problemas', err);
        alert('No se pudieron cargar los problemas. Verificá tu conexión o tu sesión.');
      }
    });
  }

  toggleProblema(id: number): void {
    const index = this.problemasSeleccionados.indexOf(id);
    if (index > -1) {
      this.problemasSeleccionados.splice(index, 1);
    } else {
      this.problemasSeleccionados.push(id);
    }
  }

  buscarTecnicos(): void {
    if (this.problemasSeleccionados.length === 0) {
      alert('Por favor, seleccioná al menos un problema.');
      return;
    }
    
    this.solicitudService.buscarTecnicos(this.problemasSeleccionados).subscribe({
      next: (tecnicos) => {
        this.tecnicosDisponibles = tecnicos;
        this.pasoActual = 2; 
      },
      error: (err) => {
        alert('Hubo un error al buscar técnicos. Intentá nuevamente.');
        console.error(err);
      }
    });
  }

  seleccionarTecnico(tecnico: any): void {
    this.tecnicoElegido = tecnico;
    this.pasoActual = 3; 
  }

  confirmarSolicitud(): void {
    const dtoPago = {
      clienteId: 1, // ACORDATE: esto luego lo tenés que sacar de los datos del usuario logueado
      tecnicoId: this.tecnicoElegido.tecnicoId,
      precioTotal: this.tecnicoElegido.precioVar,
      problemasIds: this.problemasSeleccionados,
      metodoPago: this.datosPago.metodoPago,
      nroTarjeta: this.datosPago.nroTarjeta,
      codSeguridadTarjeta: this.datosPago.codSeguridadTarjeta,
      fechaVencTarjeta: this.datosPago.fechaVencTarjeta
    };

    this.solicitudService.confirmarPago(dtoPago).subscribe({
      next: (res) => {
        alert('¡Éxito! ' + (res.mensaje || 'Tu técnico está en camino.'));
        this.pasoActual = 1;
        this.problemasSeleccionados = [];
        this.tecnicoElegido = null;
      },
      error: (err) => {
        alert('Error al procesar el pago. Revisá los datos.');
        console.error(err);
      }
    });
  }
}

