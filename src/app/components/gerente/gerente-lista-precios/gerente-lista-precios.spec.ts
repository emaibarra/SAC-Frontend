import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenteListaPrecios } from './gerente-lista-precios';

describe('GerenteListaPrecios', () => {
  let component: GerenteListaPrecios;
  let fixture: ComponentFixture<GerenteListaPrecios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteListaPrecios],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteListaPrecios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
