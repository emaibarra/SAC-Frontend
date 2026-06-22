import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenteReportes } from './gerente-reportes';

describe('GerenteReportes', () => {
  let component: GerenteReportes;
  let fixture: ComponentFixture<GerenteReportes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteReportes],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteReportes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
