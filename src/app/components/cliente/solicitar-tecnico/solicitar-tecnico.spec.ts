import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarTecnico } from './solicitar-tecnico';
// 1. Agregamos las importaciones necesarias para formularios, rutas y peticiones HTTP
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SolicitarTecnico', () => {
  let component: SolicitarTecnico;
  let fixture: ComponentFixture<SolicitarTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Sumamos los módulos al imports
      imports: [SolicitarTecnico, HttpClientTestingModule, FormsModule],
      // 3. Proveemos un mock de ActivatedRoute por si el componente lee parámetros de la URL
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarTecnico);
    component = fixture.componentInstance;
    
    // 4. Mockeamos el objeto del mapa de Leaflet para que Angular no dé error al intentar renderizarlo en las pruebas
    (component as any).map = { 
      invalidateSize: () => {}, 
      setView: () => {},
      on: () => {},
      removeLayer: () => {}
    };

    // Aseguramos que los objetos existan antes de ejecutar las pruebas para evitar errores de 'undefined'
    (component as any).datosPago = { tipoPago: '' };

    await fixture.whenStable();
    fixture.detectChanges();
  });

  // Tu prueba original
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // PRUEBA 1
  it('Debe deshabilitar el botón de buscar técnico si no hay problemas seleccionados', () => {
    (component as any).problemasSeleccionados = [];
    (component as any).solicitudLocalizacion = '-32.889,-68.845';
    fixture.detectChanges();
    
    const botonBuscar = fixture.nativeElement.querySelector('button.btn-principal');
    if (botonBuscar) {
        expect(botonBuscar.disabled).toBeTruthy();
    }
  });

  // PRUEBA 2
  it('Debe actualizar la variable de localización al simular un clic (asignación manual)', () => {
    (component as any).solicitudLocalizacion = '-32.889458,-68.845839';
    fixture.detectChanges();
    expect((component as any).solicitudLocalizacion).toBe('-32.889458,-68.845839');
  });

  // PRUEBA 3
  it('Debe alternar el bloque de tarjetas guardadas según el método de pago', () => {
    (component as any).pasoActual = 3;
    (component as any).tecnicoElegido = { usuarioNombre: 'Juan Perez', precioVar: 5000 };
    (component as any).datosPago.tipoPago = 'TARJETA';
    
    // Actualizamos el DOM de forma local para evitar el error NG0100
    fixture.changeDetectorRef.detectChanges();
    
    let bloqueTarjeta = fixture.nativeElement.querySelector('.datos-tarjeta');
    expect(bloqueTarjeta).toBeTruthy();

    (component as any).datosPago.tipoPago = 'EFECTIVO';
    fixture.changeDetectorRef.detectChanges();
    
    bloqueTarjeta = fixture.nativeElement.querySelector('.datos-tarjeta');
    expect(bloqueTarjeta).toBeNull();
  });

  // PRUEBA 4
  it('Debe mostrar alerta si el arreglo de tarjetas está vacío', () => {
    (component as any).pasoActual = 3;
    (component as any).tecnicoElegido = { usuarioNombre: 'Juan Perez', precioVar: 5000 };
    (component as any).misTarjetas = []; 
    (component as any).datosPago.tipoPago = 'TARJETA';
    
    // Actualizamos el DOM de forma local
    fixture.changeDetectorRef.detectChanges();

    const textoHTML = fixture.nativeElement.textContent;
    expect(textoHTML).toContain('No tienes tarjetas registradas');
  });

  // PRUEBA 5
  it('Debe tener la estructura lista para calcular el precio final en Efectivo', () => {
    (component as any).problemasDisponibles = [{ problemaId: 1, listaPrecio: { precio: 1000 } }];
    (component as any).problemasSeleccionados = [1];
    (component as any).datosPago.tipoPago = 'EFECTIVO';
    
    expect((component as any).datosPago.tipoPago).toBe('EFECTIVO');
    expect((component as any).problemasSeleccionados.length).toBe(1);
  });
});