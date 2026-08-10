import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
  selector: 'app-abm-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './abm-empresa.component.html',
  styleUrl: './abm-empresa.component.css'
})
export class AbmEmpresaComponent implements OnInit, AfterViewInit {
  
  empresas: any[] = [];
  
  nuevaEmpresa: any = { 
    empresaNombre: '', 
    empresaTelefono: '', 
    empresaCUIL: '', 
    empresaDireccion: '',
    username: '',    
    password: '',  
    coordenadas: ''
  };

  // Variables para controlar la edición
  modoEdicion: boolean = false;
  idEmpresaEdicion: number | null = null;

  private empresaService = inject(EmpresaService);
  private map: any;
  private marker: any;

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  private inicializarMapa(): void {
    this.map = L.map('mapa-empresa').setView([-32.89084, -68.82717], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      this.nuevaEmpresa.coordenadas = `${lat},${lng}`;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      
      this.marker = L.marker([lat, lng]).addTo(this.map);
    });
  }

  cargarEmpresas(): void {
    this.empresaService.getEmpresas().subscribe({
      next: (data: any[]) => this.empresas = data,
      error: (err: any) => console.error('Error al cargar empresas', err)
    });
  }

  // --- NUEVA FUNCIÓN: Carga los datos de la tabla al formulario ---
  editarEmpresa(empresa: any): void {
    this.modoEdicion = true;
    // IMPORTANTE: Asegúrate de que tu backend use 'id' o 'empresaId'
    this.idEmpresaEdicion = empresa.id || empresa.empresaId; 
    
    this.nuevaEmpresa = {
      empresaNombre: empresa.empresaNombre,
      empresaTelefono: empresa.empresaTelefono,
      empresaCUIL: empresa.empresaCUIL,
      empresaDireccion: empresa.empresaDireccion,
      username: empresa.username || '', 
      password: '', // Lo dejamos vacío por seguridad, si lo envías vacío que el backend no lo pise
      coordenadas: empresa.coordenadas || ''
    };

    // Si la empresa ya tenía coordenadas, ponemos el pin en el mapa y centramos
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }

    if (this.nuevaEmpresa.coordenadas) {
      const coords = this.nuevaEmpresa.coordenadas.split(',');
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        this.marker = L.marker([lat, lng]).addTo(this.map);
        this.map.setView([lat, lng], 14); // Hacemos zoom al punto exacto
      }
    } else {
      this.map.setView([-32.89084, -68.82717], 12); // Vista por defecto
    }

    // Opcional: Subimos la pantalla hacia el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- NUEVA FUNCIÓN: Cancela la edición y limpia todo ---
  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.idEmpresaEdicion = null;
    this.nuevaEmpresa = { empresaNombre: '', empresaTelefono: '', empresaCUIL: '', empresaDireccion: '', username: '', password: '', coordenadas: '' };
    
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    this.map.setView([-32.89084, -68.82717], 12);
  }

  // --- MODIFICADA: Ahora decide si crear o actualizar ---
  guardarEmpresa(): void {
    if (this.modoEdicion && this.idEmpresaEdicion) {
      // 1. Lógica de ACTUALIZAR
      this.empresaService.actualizarEmpresa(this.idEmpresaEdicion, this.nuevaEmpresa).subscribe({
        next: (respuesta: any) => {
          alert('¡Empresa actualizada con éxito!');
          this.cargarEmpresas();
          this.cancelarEdicion(); // Limpiamos todo al terminar
        },
        error: (err: any) => {
          console.error('Error al actualizar la empresa', err);
          alert('Hubo un error al actualizar la empresa.');
        }
      });
    } else {
      // 2. Lógica de CREAR (Lo que ya tenías)
      this.empresaService.crearEmpresa(this.nuevaEmpresa).subscribe({
        next: (respuesta: any) => {
          alert('¡Empresa y Usuario creados con éxito!');
          this.cargarEmpresas(); 
          this.cancelarEdicion(); // Usamos la misma función para limpiar todo
        },
        error: (err: any) => {
          console.error('Error al guardar la empresa', err);
          alert('Hubo un error al guardar la empresa.');
        }
      });
    }
  }
  
  eliminarEmpresa(id: number): void {
    if (confirm('¿Estás totalmente seguro de eliminar esta empresa? (Se eliminará también su usuario de acceso)')) {
      this.empresaService.eliminarEmpresa(id).subscribe({
        next: (res: any) => {
          alert('Empresa eliminada correctamente.');
          this.cargarEmpresas(); 
        },
        error: (err: any) => {
          console.error('Error al eliminar', err);
          alert('Hubo un error al eliminar. Verificá la consola.');
        }
      });
    }
  }
}