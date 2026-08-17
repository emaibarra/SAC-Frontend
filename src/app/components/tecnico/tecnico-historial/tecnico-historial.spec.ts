import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicoHistorial } from './tecnico-historial';

describe('TecnicoHistorial', () => {
  let component: TecnicoHistorial;
  let fixture: ComponentFixture<TecnicoHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoHistorial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnicoHistorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
