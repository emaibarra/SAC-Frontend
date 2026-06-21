import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenteZonas } from './gerente-zonas';

describe('GerenteZonas', () => {
  let component: GerenteZonas;
  let fixture: ComponentFixture<GerenteZonas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteZonas],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteZonas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
