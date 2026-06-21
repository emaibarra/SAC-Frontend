import { Routes } from '@angular/router';

// --- IMPORTACIONES DE COMPONENTES ---
import { LoginComponent } from './components/login/login.component';
import { AbmEmpresaComponent } from './components/admin/abm-empresa/abm-empresa.component';
import { AbmProvinciaComponent } from './components/admin/abm-provincia/abm-provincia.component';
import { AbmZonaComponent } from './components/admin/abm-zona/abm-zona';
import { AbmEstadoSolicitudComponent } from './components/admin/abm-estado-solicitud/abm-estado-solicitud';
// Si tienes un componente principal para el dashboard, descomenta y ajusta esta línea:
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { DashboardTecnicoComponent } from './components/tecnico/dashboard-tecnico/dashboard-tecnico';
import { roleGuard } from './services/role-guard';
import { DashboardGerenteComponent } from './components/gerente/gerente-dashboard/gerente-dashboard.component';
import { GerenteTecnicosComponent } from './components/gerente/gerente-tecnicos/gerente-tecnicos.component';
import { GerenteZonasComponent } from './components/gerente/gerente-zonas/gerente-zonas';
import { AbmTipoDniComponent } from './components/admin/abm-tipo-dni/abm-tipo-dni';
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
  path: 'admin/zonas', 
  component: AbmZonaComponent,
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
  { path: 'gerente/dashboard', component: DashboardGerenteComponent },
  //Ruta para gestionar técnicos (solo visible para el gerente)
{ path: 'gerente/tecnicos', component: GerenteTecnicosComponent },
  // NUEVA RUTA PARA ESTADOS
  { 
    path: 'admin/estados', 
    component: AbmEstadoSolicitudComponent,
    canActivate: [roleGuard],
    data: { rolEsperado: 'ADMINISTRADOR' } 
  },
// --- RUTAS DEL TÉCNICO---
  { 
    path: 'tecnico', 
    component: DashboardTecnicoComponent,
    canActivate: [roleGuard],
    data: { rolEsperado: 'TECNICO' } // Asumiendo que crearás este rol
  },
  { 
    path: 'gerente/zonas', 
    component: GerenteZonasComponent 
    // canActivate: [RoleGuard], // Agrega esto si tienes el guard configurado
    // data: { expectedRole: 'GERENTE' }
  },
  { path: 'admin/tipos-dni', component: AbmTipoDniComponent},
  // Redirecciones por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];