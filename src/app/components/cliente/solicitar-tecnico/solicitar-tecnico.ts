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
    // Usamos las imágenes oficiales alojadas en la nube para evitar conflictos de rutas en Angular
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
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
      coordenadasCliente: this.solicitudLocalizacion 
    };
    
    // Enviamos el objeto completo
    this.solicitudService.buscarTecnicos(requestPayload).subscribe({
      next: (tecnicos) => {
        // 1. Convertimos la ubicación del cliente a un objeto LatLng de Leaflet
        const [latCliente, lngCliente] = this.solicitudLocalizacion.split(',').map(Number);
        const puntoCliente = L.latLng(latCliente, lngCliente);

        // 2. Mapeamos la lista de técnicos para calcular el precio dinámico de cada uno
        this.tecnicosDisponibles = tecnicos.map((tecnico: any) => {
          
          // Usamos las coordenadas del técnico (Aquí aplicamos las hardcodeadas por ahora)
          const latTecnico = -32.8994;
          const lngTecnico = -68.8354;
          const puntoTecnico = L.latLng(latTecnico, lngTecnico);

          // 3. Leaflet calcula la distancia en metros, la pasamos a Kilómetros
          const distanciaMetros = puntoCliente.distanceTo(puntoTecnico);
          const distanciaKm = distanciaMetros / 1000;

          // 4. Obtenemos los valores de la empresa (Con un valor de respaldo por si llegan vacíos)
          // OJO: Revisa si en tu backend estas variables se llaman así dentro de "empresa"
          const precioBase = tecnico.empresa?.precioBase || 2000; 
          const precioPorKm = tecnico.empresa?.precioPorKm || 500;

          // 5. Aplicamos la fórmula matemática del precio total
          const precioCalculado = precioBase + (distanciaKm * precioPorKm);

          // 6. Retornamos el técnico con el nuevo precio modificado y la distancia
          return {
            ...tecnico,
            distanciaKm: distanciaKm.toFixed(1), // Guardamos los km para que puedas mostrarlos en el HTML
            precioVar: Math.round(precioCalculado) // Sobreescribimos el 5000 por el precio real redondeado
          };
        });

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
      precioTotal: this.tecnicoElegido.precioVar,
      problemasIds: this.problemasSeleccionados,
      metodoPago: this.datosPago.metodoPago,
      coordenadasCliente: this.solicitudLocalizacion
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

