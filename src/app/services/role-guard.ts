import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Si no hay token, lo mandamos directo al login
  if (!authService.estaLogueado()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Leemos qué rol exige la ruta a la que quiere entrar (lo configuramos en el paso 3)
  const rolEsperado = route.data['rolEsperado'];
  const rolActual = authService.getRol();

  // 3. Si la ruta exige un rol y el usuario tiene otro, lo sacamos
  if (rolEsperado && rolActual !== rolEsperado) {
    console.error('Acceso denegado: No tienes el rol necesario');
    router.navigate(['/login']); // En un sistema real podrías mandarlo a una pantalla de "403 No Autorizado"
    return false;
  }

  // 4. Si todo está en orden, lo dejamos pasar
  return true;
};