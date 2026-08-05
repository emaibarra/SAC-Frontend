import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AbmEstadoSolicitudComponent } from './abm-estado-solicitud';

describe('AbmEstadoSolicitudComponent', () => {
  let component: AbmEstadoSolicitudComponent;
  let fixture: ComponentFixture<AbmEstadoSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmEstadoSolicitudComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AbmEstadoSolicitudComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
