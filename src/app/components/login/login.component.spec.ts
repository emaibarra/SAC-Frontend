import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs'; // <-- Usaremos Observable nativo

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('LoginComponent - Validaciones de Seguridad con Vitest', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceMock = {
    login: vi.fn()
  };

  let routerMock = {
    navigate: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('Debe mostrar alerta de error y no navegar si las credenciales son incorrectas', async () => {

    // 1. CAPTURA DE ALERTA 100% SEGURA
    // Usamos una variable de texto en lugar de un "espía" complejo de Vitest.
    // Esto evita que el entorno simulado (JSDOM) "pierda" el rastro de la alerta.
    let mensajeCapturado = '';
    const alertaFalsa = (msg: string) => {
      mensajeCapturado = msg;
    };

    // Reemplazamos la alerta en todos los contextos posibles del navegador
    vi.stubGlobal('alert', alertaFalsa);
    window.alert = alertaFalsa as any;

    // 2. SIMULAR RECHAZO DEL BACKEND DE FORMA NATIVA (Sin usar throwError)
    // Creamos un Observable manual que falla instantáneamente.
    // Esto garantiza que Angular entre SÍ o SÍ al bloque "error: (err) => { ... }" de tu componente
    authServiceMock.login.mockReturnValue(new Observable(subscriber => {
      subscriber.error(new Error('401 Unauthorized'));
    }));

    component.credenciales = {
      username: 'usuario_invalido_99',
      password: 'clavefalsa123'
    };
component.iniciarSesion();

    // Damos tiempo para que Angular detecte los cambios
    fixture.detectChanges();
    await fixture.whenStable(); 
    expect(mensajeCapturado).toBe('Credenciales incorrectas o acceso no autorizado');
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(authServiceMock.login).toHaveBeenCalledWith(component.credenciales);   

     
    
    // C. Comprobamos nuestra variable segura en lugar del espía de Vitest
    expect(mensajeCapturado).toBe('Credenciales incorrectas');
  });
});