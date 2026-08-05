import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientePerfil } from './cliente-perfil';
// 1. Agregamos las importaciones para testear el HTTP
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
describe('ClientePerfil', () => {
  let component: ClientePerfil;
  let fixture: ComponentFixture<ClientePerfil>;
  let httpMock: HttpTestingController; // 2. Declaramos la variable del mock HTTP

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 3. Añadimos el HttpClientTestingModule a los imports
      imports: [ClientePerfil, HttpClientTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientePerfil);
    component = fixture.componentInstance;
    
    // 4. Inyectamos el controlador para poder espiar las peticiones
    httpMock = TestBed.inject(HttpTestingController);

    // Evitamos posibles errores si tu ngOnInit busca datos del cliente en el localStorage
    (component as any).cliente = { clienteToken: 1 };

    await fixture.whenStable();
  });

  // Tu prueba original que verifica que el componente cargue bien
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 5. Agregamos la PRUEBA 6
  it('No debe llamar al endpoint DELETE si el usuario cancela la confirmación', () => {
    // Sobreescribimos el confirm nativo saltando las reglas de TypeScript
    (window as any).confirm = () => false;
    
    const mockTarjeta: any = { metodoPagoId: 9 };
    
    // Llamamos al método
    (component as any).eliminarMetodoPago(mockTarjeta);

    // Verificamos que no salga ninguna petición HTTP hacia el backend
    httpMock.expectNone(`http://localhost:8080/api/metodos-pago/9`);
  });
});