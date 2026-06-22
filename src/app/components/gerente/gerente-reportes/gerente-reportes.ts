import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TecnicoService } from '../../../services/tecnico.service';
import { ProblemaService } from '../../../services/problema.service';
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
  private problemaService = inject(ProblemaService);
  private authService = inject(AuthService);

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
          
          // 2. Agrupamos y contamos cuántos hay por cada Zona
          const conteoPorZona: any = {};
          misTecnicos.forEach(t => {
            const nombreZona = t.zonaEmpresa?.zonaEmpresaNombre || 'Sin Zona Asignada';
            if (!conteoPorZona[nombreZona]) {
              conteoPorZona[nombreZona] = 0;
            }
            conteoPorZona[nombreZona]++;
          });

          // 3. Convertimos el objeto a un arreglo para mostrarlo en el HTML
          this.datosZonas = Object.keys(conteoPorZona).map(zona => ({
            zonaNombre: zona,
            cantidadTecnicos: conteoPorZona[zona]
          }));
        },
        error: (err) => console.error('Error al cargar técnicos para el reporte', err)
      });
      
    } else if (this.tipoReporte === 'Problema') {
      this.problemaService.getProblemas().subscribe({
        next: (problemas) => {
          this.datosProblemas = problemas;
        },
        error: (err) => console.error('Error al cargar problemas para el reporte', err)
      });
    }
  }

  // Función que abre la ventana de impresión/Guardar como PDF del navegador
  imprimirPDF(): void {
    window.print();
  }
}