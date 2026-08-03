import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteHistorial } from './cliente-historial';

describe('ClienteHistorial', () => {
  let component: ClienteHistorial;
  let fixture: ComponentFixture<ClienteHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteHistorial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteHistorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
