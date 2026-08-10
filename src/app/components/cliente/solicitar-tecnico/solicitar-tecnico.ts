import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { SolicitudService } from '../../../services/solicitud.service';
import { ProblemaService } from '../../../services/problema.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-solicitar-tecnico',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './solicitar-tecnico.html',
  styleUrl: './solicitar-tecnico.css',
})
export class SolicitarTecnico implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private router = inject(Router);
  
  pasoActual: number = 1; 
  solicitudLocalizacion: string = '';
  problemasDisponibles: any[] = []; 
  problemasSeleccionados: number[] = [];
  
  misTarjetas: any[] = [];
  tecnicosDisponibles: any[] = [];
  tecnicoElegido: any = null;

  // Mantenemos 'EFECTIVO' por defecto y un campo para el ID de tarjeta opcional
  datosPago = {
    tipoPago: 'EFECTIVO',      // Puede ser 'EFECTIVO' o 'TARJETA'
    metodoPagoId: null as number | null
  };

  private solicitudService = inject(SolicitudService);
  private problemaService = inject(ProblemaService);

  private map!: L.Map;
  private marker!: L.Marker;
  private defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  ngOnInit(): void {
    this.cargarProblemas();
    this.cargarTarjetasCliente();
  }

  cargarTarjetasCliente(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const clienteToken = usuario.clienteToken;

      this.http.get<any[]>(`http://localhost:8080/api/metodos-pago/cliente/${clienteToken}`).subscribe({
        next: (data) => {
          this.misTarjetas = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar métodos de pago', err);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('mapa-cliente').setView([-32.889458, -68.845839], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      this.solicitudLocalizacion = `${lat},${lng}`;
      this.cdr.detectChanges(); 

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: this.defaultIcon }).addTo(this.map);
      }
    });
  }

  volverAlPaso1(): void {
    this.pasoActual = 1;
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 0);
  }

  cargarProblemas(): void {
    this.problemaService.getProblemas().subscribe({
      next: (data) => {
        this.problemasDisponibles = data;
        this.cdr.detectChanges();
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
    // Validamos si falta seleccionar un problema o la ubicación
    if (this.problemasSeleccionados.length === 0 || !this.solicitudLocalizacion) {
      alert('Por favor, selecciona al menos un problema y tu ubicación en el mapa antes de continuar.');
      return; 
    }
    
    const requestPayload = {
      problemasIds: this.problemasSeleccionados,
      coordenadasCliente: this.solicitudLocalizacion,
      metodoPagoId: null
    };
    
    this.solicitudService.buscarTecnicos(requestPayload).subscribe({
      next: (tecnicos) => {
        const [latCliente, lngCliente] = this.solicitudLocalizacion.split(',').map(Number);
        const puntoCliente = L.latLng(latCliente, lngCliente);
        let costoProblemas = 0;
        
        this.problemasSeleccionados.forEach(id => {
          const problemaEncontrado = this.problemasDisponibles.find(p => p.problemaId === id);
          if (problemaEncontrado && problemaEncontrado.listaPrecio && problemaEncontrado.listaPrecio.precio) {
            costoProblemas += problemaEncontrado.listaPrecio.precio;
          }
        });

        this.tecnicosDisponibles = tecnicos.map((tecnico: any) => {
          
          // --- INICIO DE LA MODIFICACIÓN ---
          // Valores por defecto por si la empresa aún no tiene coordenadas guardadas
          let latTecnico = -32.8994;
          let lngTecnico = -68.8354;

          // Verificamos si el técnico tiene empresa y si esa empresa tiene coordenadas
          if (tecnico.empresa && tecnico.empresa.coordenadas) {
            const coordsEmpresa = tecnico.empresa.coordenadas.split(',');
            latTecnico = parseFloat(coordsEmpresa[0]);
            lngTecnico = parseFloat(coordsEmpresa[1]);
          }
          // --- FIN DE LA MODIFICACIÓN ---

          const puntoTecnico = L.latLng(latTecnico, lngTecnico);

          const distanciaMetros = puntoCliente.distanceTo(puntoTecnico);
          const distanciaKm = distanciaMetros / 1000;

          const precioBase = tecnico.empresa?.precio || 2000; 
          const precioPorKm = tecnico.empresa?.precioPorKm || 500;
          const precioCalculado = precioBase + (distanciaKm * precioPorKm) + costoProblemas;

          return {
            ...tecnico,
            distanciaKm: distanciaKm.toFixed(1),
            precioVar: Math.round(precioCalculado)
          };
        });

        this.pasoActual = 2;
        this.cdr.detectChanges(); 
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
    if (!this.solicitudLocalizacion || this.solicitudLocalizacion.trim() === '') {
      alert('Por favor, ingresá la dirección donde te encontrás.');
      this.pasoActual = 1;
      return;
    }

    // Validamos si eligió tarjeta pero olvidó seleccionarla en la lista
    if (this.datosPago.tipoPago === 'TARJETA' && !this.datosPago.metodoPagoId) {
      alert('Por favor, seleccioná una de tus tarjetas guardadas.');
      return;
    }

    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;
    const clienteIdReal = usuario?.clienteToken;

    const dtoPago: any = {
      clienteId: clienteIdReal, 
      tecnicoId: this.tecnicoElegido.tecnicoId,
      precioTotal: this.tecnicoElegido.precioVar,
      problemasIds: this.problemasSeleccionados,
      // Si paga en efectivo enviamos null en el ID de tarjeta, si paga con tarjeta enviamos su ID
      metodoPago: this.datosPago.tipoPago === 'EFECTIVO' ? null : this.datosPago.metodoPagoId,
      coordenadasCliente: this.solicitudLocalizacion
    };

    this.solicitudService.confirmarPago(dtoPago).subscribe({
      next: (res) => {
        alert('¡Éxito! ' + (res.mensaje || 'Tu técnico está en camino.'));
        
        this.router.navigate(['/cliente/dashboard']);
        
        if (this.marker) {
          this.map.removeLayer(this.marker);
          this.marker = undefined as any;
        }
        this.datosPago = { tipoPago: 'EFECTIVO', metodoPagoId: null };
      },
      error: (err) => {
        alert('Error al procesar la solicitud. Revisá los datos o probá más tarde.');
        console.error(err);
      }
    });
  }
}