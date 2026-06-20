import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-abm-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './abm-empresa.component.html',
  styleUrl: './abm-empresa.component.css'
})
export class AbmEmpresaComponent implements OnInit {
  
  empresas: any[] = [];
  
  // ¡Actualizamos el objeto para incluir dirección, username y password!
  nuevaEmpresa: any = { 
    empresaNombre: '', 
    empresaTelefono: '', 
    empresaCUIL: '', 
    empresaDireccion: '',
    username: '',    // Para crear el usuario
    password: ''     // Para crear el usuario
  };

  private empresaService = inject(EmpresaService);

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.getEmpresas().subscribe({
      next: (data: any[]) => this.empresas = data,
      error: (err: any) => console.error('Error al cargar empresas', err)
    });
  }

  guardarEmpresa(): void {
    this.empresaService.crearEmpresa(this.nuevaEmpresa).subscribe({
      next: (respuesta: any) => {
        alert('¡Empresa y Usuario creados con éxito!');
        this.cargarEmpresas(); 
        // Vaciamos el formulario
        this.nuevaEmpresa = { empresaNombre: '', empresaTelefono: '', empresaCUIL: '', empresaDireccion: '', username: '', password: '' };
      },
      error: (err: any) => {
        console.error('Error al guardar la empresa', err);
        alert('Hubo un error al guardar la empresa.');
      }
    });
  }
}