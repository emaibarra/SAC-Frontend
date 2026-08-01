import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  pasoActual: number = 1; 
  solicitudLocalizacion: string = '';
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
      this.cdr.detectChanges(); // 3. Avisale a Angular que los datos cambiaron
    },
    error: (err) => {
      console.error('Error al cargar', err);
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
   // Validamos que haya puesto la dirección
  if (!this.solicitudLocalizacion || this.solicitudLocalizacion.trim() === '') {
    alert('Por favor, ingresá la dirección donde te encontrás.');
    this.pasoActual = 1; // Lo devolvemos al paso 1
    return;
  }
    // 1. Validaciones básicas según el método de pago
    if (this.datosPago.metodoPago === 'VISA') {
      if (!this.datosPago.nroTarjeta || !this.datosPago.fechaVencTarjeta || !this.datosPago.codSeguridadTarjeta) {
        alert('Por favor, completa todos los datos de la tarjeta VISA.');
        return; // Detenemos la ejecución aquí si faltan datos
      }
    }

    // 2. Preparamos el objeto a enviar
    const dtoPago: any = {
      clienteId: 1, // ACORDATE: esto luego lo tenés que sacar de los datos del usuario logueado
      tecnicoId: this.tecnicoElegido.tecnicoId,
      solicitudPrecio: this.tecnicoElegido.precioVar,
      problemasIds: this.problemasSeleccionados,
      metodoPago: this.datosPago.metodoPago,
      solicitudLocalizacion: this.solicitudLocalizacion
    };

    // 3. Solo agregamos los datos de la tarjeta si eligió VISA
    if (this.datosPago.metodoPago === 'VISA') {
      dtoPago.nroTarjeta = this.datosPago.nroTarjeta;
      dtoPago.codSeguridadTarjeta = this.datosPago.codSeguridadTarjeta;
      dtoPago.fechaVencTarjeta = this.datosPago.fechaVencTarjeta;
    }

    // 4. Enviamos la petición
    this.solicitudService.confirmarPago(dtoPago).subscribe({
      next: (res) => {
        alert('¡Éxito! ' + (res.mensaje || 'Tu técnico está en camino.'));
        this.pasoActual = 1;
        this.problemasSeleccionados = [];
        this.tecnicoElegido = null;
        // Opcional: limpiar también los datos de pago
        this.datosPago = { metodoPago: 'EFECTIVO', nroTarjeta: null, codSeguridadTarjeta: null, fechaVencTarjeta: '' };
      },
      error: (err) => {
        alert('Error al procesar la solicitud. Revisá los datos o probá más tarde.');
        console.error(err);
      }
    });
  }
}

