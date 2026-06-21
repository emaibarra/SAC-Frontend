import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmEstadoSolicitud } from './abm-estado-solicitud';

describe('AbmEstadoSolicitud', () => {
  let component: AbmEstadoSolicitud;
  let fixture: ComponentFixture<AbmEstadoSolicitud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmEstadoSolicitud],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmEstadoSolicitud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
