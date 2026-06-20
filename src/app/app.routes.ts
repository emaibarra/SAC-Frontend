import { Routes } from '@angular/router';

// --- IMPORTACIONES DE COMPONENTES ---
import { LoginComponent } from './components/login/login.component';
import { AbmEmpresaComponent } from './components/admin/abm-empresa/abm-empresa.component';
import { AbmProvinciaComponent } from './components/admin/abm-provincia/abm-provincia.component';
import { AbmZonaComponent } from './components/admin/abm-zona/abm-zona';
// Si tienes un componente principal para el dashboard, descomenta y ajusta esta línea:
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

import { roleGuard } from './services/role-guard';
import { GerenteDashboardComponent } from './components/gerente/gerente-dashboard/gerente-dashboard.component';

export const routes: Routes = [
  // Ruta pública
  { path: 'login', component: LoginComponent },

  // Rutas protegidas (Solo ADMINISTRADOR)
  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard], data: { rolEsperado: 'ADMINISTRADOR' } },
  
  { 
    path: 'admin/empresas', 
    component: AbmEmpresaComponent,
    canActivate: [roleGuard],
    data: { rolEsperado: 'ADMINISTRADOR' } 
  },
  { 
    path: 'admin/provincias', 
    component: AbmProvinciaComponent,
    canActivate: [roleGuard],
    data: { rolEsperado: 'ADMINISTRADOR' } 
  },

  // <-- Agregamos la ruta del gerente/empresa
  { path: 'gerente/dashboard', component: GerenteDashboardComponent },
{ 
  path: 'admin/zonas', 
  component: AbmZonaComponent,
  canActivate: [roleGuard],
  data: { rolEsperado: 'ADMINISTRADOR' } 
},
  // Redirecciones por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];