import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { SolicitudService } from '../../../services/solicitud.service';
import { ProblemaService } from '../../../services/problema.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

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

  // --- Agregado: Variables del Mapa ---
  private map!: L.Map;
  private marker!: L.Marker;
  private defaultIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  // ------------------------------------

  ngOnInit(): void {
    this.cargarProblemas();
  }

  // Agregado: Inicializamos el mapa una vez que el HTML ya cargó
  ngAfterViewInit(): void {
    this.initMap();
  }

  // Agregado: Configuración de Leaflet
  private initMap(): void {
    this.map = L.map('mapa-cliente').setView([-32.889458, -68.845839], 13); // Centrado en Mendoza

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Evento para capturar el clic
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      // Asignamos las coordenadas a tu variable existente
      this.solicitudLocalizacion = `${lat},${lng}`;
      this.cdr.detectChanges(); 

      // Colocamos o movemos el marcador
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: this.defaultIcon }).addTo(this.map);
      }
    });
  }

  // Agregado: Método auxiliar para volver al paso 1 sin que el mapa quede en gris
  volverAlPaso1(): void {
    this.pasoActual = 1;
    // Dar un respiro al DOM antes de reajustar el tamaño del mapa
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 0);
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
    
    // Armamos el objeto con la estructura exacta que espera el DTO del backend
    const requestPayload = {
      problemasIds: this.problemasSeleccionados,
      coordenadasCliente: this.solicitudLocalizacion // Aquí enviamos el string "lat,lng" del mapa
    };
    
    // Enviamos el objeto completo en lugar de solo el arreglo
    this.solicitudService.buscarTecnicos(requestPayload).subscribe({
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
        this.solicitudLocalizacion = ''; // Limpiamos la ubicación tras el éxito
        
        // Removemos el pin del mapa al completar
        if (this.marker) {
          this.map.removeLayer(this.marker);
          this.marker = undefined as any;
        }
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

