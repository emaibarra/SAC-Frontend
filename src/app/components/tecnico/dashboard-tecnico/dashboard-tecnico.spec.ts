import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTecnico } from './dashboard-tecnico';

describe('DashboardTecnico', () => {
  let component: DashboardTecnico;
  let fixture: ComponentFixture<DashboardTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTecnico],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTecnico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
