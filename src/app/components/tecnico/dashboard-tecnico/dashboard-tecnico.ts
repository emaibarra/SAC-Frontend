import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service'; 
import { AuthService } from '../../../services/auth.service'; 
import { SolicitudService } from '../../../services/solicitud.service';

// <-- MAPA: Importaciones necesarias
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-dashboard-tecnico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-tecnico.html'
})
export class DashboardTecnicoComponent implements OnInit {

  private router = inject(Router);
  private tecnicoService = inject(TecnicoService); 
  private authService = inject(AuthService); 
  private solicitudService = inject(SolicitudService);

  miPerfil: any = null;
  estadoActual: string = 'DISPONIBLE';
  asistenciaActiva: boolean = false; 

  solicitudesPendientes: any[] = [];
  solicitudActiva: any = null;

  // <-- MAPA: Variables para el mapa y coordenadas hardcodeadas
  private map: any;
  private routingControl: any;
  private tecnicoUbicacion: [number, number] = [-32.8994, -68.8354]; // Belgrano, Mendoza
  private iconConfig = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  ngOnInit(): void {
    const usuarioLogueado = this.authService.getUsuarioActual();
    if (usuarioLogueado && usuarioLogueado.username) {
      this.tecnicoService.getPerfilPorUsername(usuarioLogueado.username).subscribe({
        next: (data) => {
          this.miPerfil = data;
          this.cargarSolicitudes(); 
        },
        error: (err) => console.error('Error al cargar mi perfil de técnico', err)
      });
    }
  }

  cargarSolicitudes(): void {
    if (!this.miPerfil) return;
    const idTecnico = this.miPerfil.tecnicoCodigo; 

    this.solicitudService.getSolicitudesPorTecnicoYEstado(idTecnico, 'Pendiente')
      .subscribe(res => this.solicitudesPendientes = res);

    this.solicitudService.getSolicitudesPorTecnicoYEstado(idTecnico, 'Aceptada')
      .subscribe(res => {
        if (res && res.length > 0) {
          this.solicitudActiva = res[0];
          this.asistenciaActiva = true; 
          this.estadoActual = 'OCUPADO';
          
          // <-- MAPA: Si ya estaba en curso, cargamos el mapa al iniciar
          setTimeout(() => this.inicializarMapaRuta(), 200);
        }
      });
  }

  aceptarEncargo(solicitud: any): void {
    this.solicitudService.cambiarEstadoSolicitud(solicitud.solicitudId, 'Aceptada').subscribe({
      next: () => {
        this.solicitudActiva = solicitud;
        this.asistenciaActiva = true; 
        this.estadoActual = 'OCUPADO';
        
        // <-- MAPA: Usamos setTimeout para que Angular renderice el div *ngIf antes de inyectar Leaflet
        setTimeout(() => this.inicializarMapaRuta(), 200);

        this.cargarSolicitudes(); 
      },
      error: (err) => alert('Error: ' + err.error?.error)
    });
  }

  rechazarEncargo(solicitudId: number): void {
    if(confirm('¿Seguro que deseas rechazar este encargo?')) {
      this.solicitudService.cambiarEstadoSolicitud(solicitudId, 'Cancelada').subscribe({
        next: () => this.cargarSolicitudes(),
        error: (err) => alert('Error: ' + err.error?.error)
      });
    }
  }

  cancelarEncargo(): void {
    if (confirm('¿Seguro que deseas cancelar este trabajo en curso?')) {
       if (this.solicitudActiva) {
         this.solicitudService.cambiarEstadoSolicitud(this.solicitudActiva.solicitudId, 'Cancelada').subscribe({
           next: () => {
             this.limpiarVistaActiva(); // <-- MAPA: Refactorizamos para no repetir código
             alert('Encargo cancelado.');
             this.cargarSolicitudes();
           },
           error: (err) => alert('Error al cancelar: ' + err.error?.error)
         });
       }
    }
  }

  completarAsistencia(): void {
    if (confirm('¿Confirmas que la asistencia fue resuelta con éxito?')) {
      if (this.solicitudActiva) {
        this.solicitudService.cambiarEstadoSolicitud(this.solicitudActiva.solicitudId, 'Terminada').subscribe({
          next: () => {
            this.limpiarVistaActiva(); // <-- MAPA: Refactorizamos para limpiar mapa
            alert('¡Excelente trabajo! Volviste a estar Disponible.');
            this.cargarSolicitudes();
          },
          error: (err) => alert('Error al concluir: ' + err.error?.error)
        });
      }
    }
  }

  // <-- MAPA: Método auxiliar para limpiar variables y mapa
  limpiarVistaActiva(): void {
    this.asistenciaActiva = false; 
    this.estadoActual = 'DISPONIBLE';
    this.solicitudActiva = null;
    if (this.map) {
      this.map.remove(); // Destruimos el mapa para liberar memoria
      this.map = null;
    }
  }

  cambiarEstado(nuevoEstado: string): void {
    this.estadoActual = nuevoEstado;
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión? Dejarás de recibir alertas.')) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      this.router.navigate(['/login']);
    }
  }

  // ==========================================
  // <-- MAPA: LÓGICA DE LEAFLET Y RUTAS
  // ==========================================
  inicializarMapaRuta(): void {
    // Si ya existe una instancia de mapa, la borramos para evitar errores de renderizado
    if (this.map) {
      this.map.remove();
    }

    // Inicializamos el contenedor del HTML
    this.map = L.map('mapaRutaTecnico').setView(this.tecnicoUbicacion, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Trazamos la ruta usando los datos de la solicitud
    this.trazarRuta();
  }

  trazarRuta(): void {
    if (!this.solicitudActiva || !this.solicitudActiva.solicitudLocalizacion) return;

    // Convertimos el string "lat,lng" a números
    const coordenadas = this.solicitudActiva.solicitudLocalizacion.split(',');
    const latCliente = parseFloat(coordenadas[0]);
    const lngCliente = parseFloat(coordenadas[1]);

    this.routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(this.tecnicoUbicacion[0], this.tecnicoUbicacion[1]), // Origen: Técnico
        L.latLng(latCliente, lngCliente)                              // Destino: Cliente
      ],
      routeWhileDragging: false,
      show: false, // <-- Oculta el panel feo de instrucciones (gire a la derecha, etc)
      addWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: (i: number, waypoint: any, n: number) => {
        return L.marker(waypoint.latLng, { icon: this.iconConfig });
      }
    }).addTo(this.map);
  }
}