import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarTecnico } from './solicitar-tecnico';

describe('SolicitarTecnico', () => {
  let component: SolicitarTecnico;
  let fixture: ComponentFixture<SolicitarTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarTecnico],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarTecnico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
