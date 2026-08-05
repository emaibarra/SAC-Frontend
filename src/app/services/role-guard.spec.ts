import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role-guard';

describe('roleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => roleGuard(...guardParameters));

  // Mock puro de JS: guardamos la ruta a la que intenta navegar
  let rutaDestino: any = null;
  let routerSpy = {
    navigate: (ruta: any[]) => { rutaDestino = ruta; }
  };

  beforeEach(() => {
    rutaDestino = null; // Reiniciamos la variable antes de cada prueba
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  // PRUEBA 7
  it('Debe redirigir al /login si el usuario no tiene sesión activa o acceso', () => {
    localStorage.clear();
    const routeMock = {} as ActivatedRouteSnapshot;
    const stateMock = {} as RouterStateSnapshot;

    executeGuard(routeMock, stateMock);

    // Verificamos si la función guardó '/login' en nuestra variable
    expect(rutaDestino).toEqual(['/login']);
  });
});