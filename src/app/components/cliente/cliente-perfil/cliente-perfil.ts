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
  
  nuevoMetodo = {
    metodoPagoNombre: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: ''
  };

  ngOnInit(): void {
    // Al iniciar el componente, ejecutamos la carga inicial
    this.inicializarPerfil();
  }

  inicializarPerfil(): void {
    const usuarioString = localStorage.getItem('usuario');
    
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        // Soportamos tanto clienteToken como id por seguridad
        const clienteId = usuario.clienteToken || usuario.id; 

        if (clienteId) {
          // Asignamos de entrada el token para que nunca viaje como nulo
          this.cliente.clienteToken = clienteId;
          
          // Disparamos la carga de datos desde el backend
          this.cargarDatosCliente(clienteId);
        } else {
          console.warn('No se encontró un ID de cliente válido en el localStorage.');
        }
      } catch (e) {
        console.error('Error al parsear el usuario del localStorage', e);
      }
    } else {
      console.warn('No hay sesión activa en el localStorage.');
    }
  }

  cargarDatosCliente(clienteId: number): void {
    this.http.get<any>(`http://localhost:8080/api/clientes/${clienteId}`).subscribe({
      next: (data) => {
        this.cliente = data;
        // Nos aseguramos de mantener el token asignado
        if (!this.cliente.clienteToken) {
          this.cliente.clienteToken = clienteId as any;
        }
        this.cargarMetodosPago(clienteId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Fallback si la API de clientes falla, usamos lo que teníamos en storage
        const usuarioString = localStorage.getItem('usuario');
        const usuario = usuarioString ? JSON.parse(usuarioString) : {};
        
        this.cliente = {
          clienteToken: clienteId as any,
          clienteNombre: usuario.clienteNombre || usuario.nombre || '',
          clienteEmail: usuario.clienteEmail || usuario.email || '',
          clienteTelefono: usuario.clienteTelefono || usuario.telefono || ''
        };
        this.cargarMetodosPago(clienteId);
        this.cdr.detectChanges();
      }
    });
  }

  cargarMetodosPago(clienteId: number): void {
    this.http.get<any[]>(`http://localhost:8080/api/metodos-pago/cliente/${clienteId}`).subscribe({
      next: (data) => {
        this.metodosPago = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar métodos de pago', err);
      }
    });
  }

  guardarCambios(): void {
    if (!this.cliente.clienteToken) {
      alert('Error: No hay un ID de cliente válido.');
      return;
    }

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
    if (!this.cliente || !this.cliente.clienteToken) {
      alert('Error: No se encontró la sesión del cliente. Por favor, vuelve a iniciar sesión.');
      return;
    }

    if (!this.nuevoMetodo.metodoPagoNombre.trim() || !this.nuevoMetodo.numeroTarjeta.trim()) {
      alert('Por favor, completa al menos el nombre y el número de la tarjeta.');
      return;
    }

    const clienteId = this.cliente.clienteToken;

    this.http.post(`http://localhost:8080/api/metodos-pago/cliente/${clienteId}`, this.nuevoMetodo).subscribe({
      next: () => {
        alert('¡Tarjeta guardada con éxito!');
        this.nuevoMetodo = {
          metodoPagoNombre: '',
          numeroTarjeta: '',
          fechaVencimiento: '',
          cvv: ''
        };
        this.cargarMetodosPago(clienteId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar método de pago', err);
        alert('Hubo un error al registrar la tarjeta.');
      }
    });
  }

  eliminarMetodoPago(metodo_pago_id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      const clienteId = this.cliente.clienteToken;

      this.http.delete(`http://localhost:8080/api/metodos-pago/${metodo_pago_id}`).subscribe({
        next: () => {
          alert('Método de pago eliminado con éxito.');
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