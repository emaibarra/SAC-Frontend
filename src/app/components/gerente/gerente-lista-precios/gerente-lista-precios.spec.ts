import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenteListaPreciosComponent } from './gerente-lista-precios';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('GerenteListaPreciosComponent - Validaciones de UI', () => {
  let component: GerenteListaPreciosComponent;
  let fixture: ComponentFixture<GerenteListaPreciosComponent>;

  beforeEach(async () => {
    // 1. Configuramos el entorno de prueba simulado (TestBed)
    await TestBed.configureTestingModule({
      imports: [GerenteListaPreciosComponent, HttpClientTestingModule, FormsModule],
      providers: [
        // Simulamos la ruta activa para que Angular no falle al buscar parámetros
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteListaPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Forzamos el primer renderizado del HTML
  });

  it('Debe mantener el botón "Guardar Tarifa" deshabilitado si el precio es texto (ej. "Cuarenta")', async () => {
    // PRECONDICIÓN: Llenamos un nombre de servicio válido
    component.listaActual.nombre = 'Cambio de cubierta';
    
    // EJECUCIÓN: Simulamos el Lote de Prueba ("Cuarenta"). 
    // En Angular, cuando intentas escribir letras en un <input type="number">,
    // el navegador lo rechaza nativamente y Angular establece el valor del modelo (ngModel) como "null".
    component.listaActual.precio = null; 

    // Refrescamos la vista para que Angular aplique los cambios al botón
    fixture.detectChanges();
    await fixture.whenStable(); // Esperamos a que los cambios del DOM terminen

    // BUSCAMOS EL BOTÓN EN EL HTML
    const botonGuardar: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

    // RESULTADO ESPERADO: Validamos que la propiedad "disabled" del botón sea verdadera (true)
    expect(botonGuardar.disabled).toBe(true);
  });
});
