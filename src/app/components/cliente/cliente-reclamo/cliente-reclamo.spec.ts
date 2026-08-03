import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteReclamo } from './cliente-reclamo';

describe('ClienteReclamo', () => {
  let component: ClienteReclamo;
  let fixture: ComponentFixture<ClienteReclamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteReclamo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteReclamo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
