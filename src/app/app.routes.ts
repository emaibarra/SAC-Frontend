import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AbmEmpresaComponent } from './components/admin/abm-empresa/abm-empresa.component';
import { roleGuard } from './services/role-guard'; // <-- Ojo acá, suele llevar un punto, no un guion

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { rolEsperado: 'ADMINISTRADOR' } 
  },
  
  // NUEVA RUTA PARA EL ABM EMPRESA
  { 
    path: 'admin/empresas', 
    component: AbmEmpresaComponent,
    canActivate: [roleGuard],
    data: { rolEsperado: 'ADMINISTRADOR' } 
  },

  { path: '**', redirectTo: '/login' }
];