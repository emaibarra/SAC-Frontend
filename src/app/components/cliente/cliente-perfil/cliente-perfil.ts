import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cliente-perfil',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-perfil.html',
  styleUrl: './cliente-perfil.css',
})
export class ClientePerfil implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  cliente = {
    clienteToken: null,
    clienteNombre: '',
    clienteEmail: '',
    clienteTelefono: ''
  };

  metodosPago: any[] = [];
  
  // 👇 1. Actualizamos este objeto con los nuevos campos de la tarjeta
  nuevoMetodo = {
    metodoPagoNombre: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: ''
  };

  ngOnInit(): void {
    this.cargarDatosCliente();
  }

  cargarDatosCliente(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const clienteId = usuario.clienteToken || usuario.id || 1;

      this.http.get<any>(`http://localhost:8080/api/clientes/${clienteId}`).subscribe({
        next: (data) => {
          this.cliente = data;
          this.cargarMetodosPago(clienteId);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.cliente = {
            clienteToken: clienteId,
            clienteNombre: usuario.clienteNombre || usuario.nombre || '',
            clienteEmail: usuario.clienteEmail || usuario.email || '',
            clienteTelefono: usuario.clienteTelefono || usuario.telefono || ''
          };
          this.cargarMetodosPago(clienteId);
          this.cdr.detectChanges();
        }
      });
    }
  }

  cargarMetodosPago(clienteId: number): void {
    this.http.get<any[]>(`http://localhost:8080/api/metodos-pago/cliente/${clienteId}`).subscribe({
      next: (data) => {
        this.metodosPago = data;
        this.cdr.detectChanges();
      }
    });
  }

  guardarCambios(): void {
    this.http.put(`http://localhost:8080/api/clientes/${this.cliente.clienteToken}`, this.cliente).subscribe({
      next: (response: any) => {
        alert('¡Información actualizada con éxito!');
        localStorage.setItem('usuario', JSON.stringify(response));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        alert('Hubo un error al actualizar los datos.');
      }
    });
  }

  agregarMetodoPago(): void {
    // 👇 2. Ajustamos la validación para exigir el nombre y el número de tarjeta
    if (!this.nuevoMetodo.metodoPagoNombre.trim() || !this.nuevoMetodo.numeroTarjeta.trim()) {
      alert('Por favor, completa al menos el nombre y el número de la tarjeta.');
      return;
    }

    const clienteId = this.cliente.clienteToken;

    this.http.post(`http://localhost:8080/api/metodos-pago/cliente/${clienteId}`, this.nuevoMetodo).subscribe({
      next: () => {
        alert('¡Tarjeta guardada con éxito!');
        // 👇 3. Limpiamos todas las propiedades del formulario de tarjeta
        this.nuevoMetodo = {
          metodoPagoNombre: '',
          numeroTarjeta: '',
          fechaVencimiento: '',
          cvv: ''
        };
        this.cargarMetodosPago(clienteId!);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar método de pago', err);
        alert('Hubo un error al registrar la tarjeta.');
      }
    });
  }
  eliminarMetodoPago(metodoPagoId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      const clienteId = this.cliente.clienteToken;

      this.http.delete(`http://localhost:8080/api/metodos-pago/${metodoPagoId}`).subscribe({
        next: () => {
          alert('Método de pago eliminado con éxito.');
          // Recargamos la lista para que desaparezca de la pantalla
          this.cargarMetodosPago(clienteId!);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al eliminar método de pago', err);
          alert('Hubo un error al intentar eliminar la tarjeta.');
        }
      });
    }
  }
}