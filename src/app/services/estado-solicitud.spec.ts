import { TestBed } from '@angular/core/testing';

import { EstadoSolicitud } from './estado-solicitud';

describe('EstadoSolicitud', () => {
  let service: EstadoSolicitud;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoSolicitud);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
