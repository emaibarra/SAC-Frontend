import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SolicitudService } from '../../../services/solicitud.service';

// --- IMPORTAMOS LEAFLET Y EL ROUTING MACHINE ---
import * as L from 'leaflet';
import 'leaflet-routing-machine'; // <-- ESTO TRAZA LA RUTA

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cliente-dashboard.html',
  styleUrl: './cliente-dashboard.css',
})
export class ClienteDashboard implements OnInit, OnDestroy {
  private router = inject(Router);
  private solicitudService = inject(SolicitudService);
  private cdr = inject(ChangeDetectorRef);

  solicitudActiva: any = null;
  solicitudParaCalificar: any = null;
  estrellasSeleccionadas: number = 0;
  pollingInterval: any;

  // --- VARIABLES PARA EL MAPA DE LEAFLET ---
  private map: L.Map | null = null;
  private routingControl: any = null; // <-- CONTROLADOR DE RUTA
  
  // Ubicación del taller/técnico (la misma que usamos en el técnico)
  private tecnicoUbicacionDefault: [number, number] = [-32.8994, -68.8354]; 
  
  private defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  ngOnInit(): void {
    this.revisarEstadoSolicitud(); 
    this.iniciarMonitoreoSolicitud();
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    this.destruirMapa();
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('usuario'); 
      this.router.navigate(['/login']);
    }
  }

  iniciarMonitoreoSolicitud(): void {
    this.pollingInterval = setInterval(() => {
      this.revisarEstadoSolicitud();
    }, 5000); 
  }

  revisarEstadoSolicitud(): void {
    const usuarioString = localStorage.getItem('usuario');
    let clienteId = 1;

    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      clienteId = usuario.clienteToken || usuario.id || 1;
    }

    this.solicitudService.getHistorialCliente(clienteId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          data.sort((a, b) => b.solicitudId - a.solicitudId);
          const ultimaSolicitud = data[0]; 
          
          const objEstado = ultimaSolicitud.estadoSolicitud || ultimaSolicitud.estado_solicitud || {};
          const estadoReal = objEstado.estadoNombre || objEstado.estado_nombre || 'INDEFINIDO';
          const estado = String(estadoReal).trim().toUpperCase(); 

          if (estado === 'PENDIENTE' || estado === 'ACEPTADA' || estado === 'EN VIAJE') {
            const modalRecienAbierto = !this.solicitudActiva;
            this.solicitudActiva = ultimaSolicitud;
            this.solicitudParaCalificar = null;

            if (modalRecienAbierto) {
              setTimeout(() => this.inicializarMapa(), 300);
            }
          } 
          else if ((estado === 'TERMINADA' || estado === 'FINALIZADO') && (!ultimaSolicitud.calificacion || ultimaSolicitud.calificacion === 0)) {
            this.solicitudActiva = null;
            this.solicitudParaCalificar = ultimaSolicitud;
            this.destruirMapa();
          } 
          else {
            this.solicitudActiva = null;
            this.solicitudParaCalificar = null;
            this.destruirMapa();
          }
          this.cdr.detectChanges(); 
        }
      },
      error: (err) => console.error("Error al buscar historial", err)
    });
  }

  // --- LÓGICA DEL MAPA LEAFLET CON RUTA ---
  inicializarMapa(): void {
    this.destruirMapa();
    
    const mapContainer = document.getElementById('mapa-seguimiento-cliente');
    if (!mapContainer) {
      setTimeout(() => this.inicializarMapa(), 200);
      return;
    }

    let latCliente = -32.889458; 
    let lngCliente = -68.845839;
    
    const ubicacion = this.solicitudActiva?.solicitudLocalizacion || this.solicitudActiva?.solicitud_localizacion;
    if (ubicacion) {
      const partes = ubicacion.split(',');
      if (partes.length === 2) {
        latCliente = parseFloat(partes[0]);
        lngCliente = parseFloat(partes[1]);
      }
    }

    this.map = L.map('mapa-seguimiento-cliente').setView([latCliente, lngCliente], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // --- MAGIA: TRAZAR LA RUTA ---
    this.routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(this.tecnicoUbicacionDefault[0], this.tecnicoUbicacionDefault[1]), // Origen: Técnico
        L.latLng(latCliente, lngCliente)                                            // Destino: Cliente
      ],
      routeWhileDragging: false,
      show: false, // Oculta las instrucciones de "gire a la derecha..."
      addWaypoints: false,
      fitSelectedRoutes: true, // Ajusta el zoom para que se vea todo el trayecto
      createMarker: (i: number, waypoint: any, n: number) => {
        // Personalizamos los marcadores
        if (i === 0) {
          return L.marker(waypoint.latLng, { icon: this.defaultIcon }).bindPopup('<b>Ubicación del Técnico</b>');
        } else {
          return L.marker(waypoint.latLng, { icon: this.defaultIcon }).bindPopup('<b>Tu ubicación</b>').openPopup();
        }
      }
    }).addTo(this.map);
  }

  destruirMapa(): void {
    // Si hay una ruta dibujada, la eliminamos primero para no causar errores de Leaflet
    if (this.routingControl) {
      try {
        this.routingControl.getPlan().setWaypoints([]);
        this.routingControl.remove();
      } catch(e) {}
      this.routingControl = null;
    }

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  cancelarViaje(): void {
    if (this.solicitudActiva) {
      if(confirm('¿Seguro que deseas cancelar tu asistencia?')) {
        this.solicitudService.cambiarEstadoSolicitud(this.solicitudActiva.solicitudId, 'Cancelada').subscribe(() => {
          this.solicitudActiva = null;
          this.destruirMapa();
          this.cdr.detectChanges();
        });
      }
    }
  }

  seleccionarEstrella(valor: number): void {
    this.estrellasSeleccionadas = valor;
  }

  enviarResena(): void {
    if (this.solicitudParaCalificar && this.estrellasSeleccionadas > 0) {
      this.solicitudService.calificarSolicitud(this.solicitudParaCalificar.solicitudId, this.estrellasSeleccionadas).subscribe(() => {
        alert('¡Gracias por tu reseña!');
        this.solicitudParaCalificar = null;
        this.estrellasSeleccionadas = 0;
        this.cdr.detectChanges();
      });
    }
  }
}