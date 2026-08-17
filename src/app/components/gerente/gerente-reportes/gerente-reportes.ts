import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Añadido para consumir el nuevo reporte
import { TecnicoService } from '../../../services/tecnico.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-gerente-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gerente-reportes.html'
})
export class GerenteReportesComponent implements OnInit {
  
  tipoReporte: string = '';
  empresaId: number | null = null;
  fechaGeneracion: Date = new Date();
  
  // Arreglos para almacenar los datos procesados que se muestran en el HTML
  datosZonas: any[] = [];
  datosProblemas: any[] = [];

  private route = inject(ActivatedRoute);
  private tecnicoService = inject(TecnicoService);
  private authService = inject(AuthService);
  private http = inject(HttpClient); // Inyectamos HttpClient
  private cdr = inject(ChangeDetectorRef);
  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    this.empresaId = usuario?.empresaId || null;

    // Leemos qué botón apretó el usuario en el dashboard (Zona o Problema)
    this.route.queryParams.subscribe(params => {
      this.tipoReporte = params['tipo'] || '';
      this.generarDatos();
    });
  }

  generarDatos(): void {
    if (this.tipoReporte === 'Zona') {
      this.tecnicoService.getTecnicos().subscribe({
        next: (tecnicos) => {
          // 1. Filtramos solo los técnicos de la empresa actual
          const misTecnicos = tecnicos.filter(t => t.empresa?.empresaId === this.empresaId);
          
          // 2. Agrupamos y guardamos los nombres en un arreglo por cada Zona
          const agrupadoPorZona: any = {};
          misTecnicos.forEach(t => {
            const zonaNombre = t.zonaEmpresa?.zonaEmpresaNombre || 'Sin Zona Asignada';
            
            // Si la zona no existe en el objeto, la inicializamos con un arreglo vacío
            if (!agrupadoPorZona[zonaNombre]) {
              agrupadoPorZona[zonaNombre] = [];
            }
            
            // Agregamos el nombre del técnico al arreglo de esa zona
            // (Asumiendo que la propiedad se llama tecnicoNombre)
            const nombreTecnico = t.tecnicoNombre || 'Técnico sin nombre';
            agrupadoPorZona[zonaNombre].push(nombreTecnico);
          });

          // 3. Convertimos el objeto a un arreglo para mostrarlo en el HTML
          this.datosZonas = Object.keys(agrupadoPorZona).map(zona => ({
            zonaNombre: zona,
            cantidadTecnicos: agrupadoPorZona[zona].length, // La cantidad es el tamaño del arreglo
            nombresTecnicos: agrupadoPorZona[zona] // Pasamos el arreglo completo de nombres a la vista
          }));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar técnicos para el reporte', err)
      });
      
    } else if (this.tipoReporte === 'Problema') {
      this.http.get<any[]>('http://localhost:8080/api/reportes/problemas-frecuentes').subscribe({
        next: (reporte) => {
          console.log('DATOS RECIBIDOS DEL BACKEND:', reporte); // 👀 Veremos esto en F12
          this.datosProblemas = reporte; 
          this.cdr.detectChanges(); // 🔄 Fuerza a Angular a actualizar la tabla
        },
        error: (err) => {
          console.error('Error al cargar el reporte de problemas', err);
        }
      });
    }
  }

  // Función que abre la ventana de impresión/Guardar como PDF del navegador
  imprimirPDF(): void {
    window.print();
  }
}