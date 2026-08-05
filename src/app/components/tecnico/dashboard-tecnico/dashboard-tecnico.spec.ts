import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardTecnicoComponent } from './dashboard-tecnico';

describe('DashboardTecnicoComponent', () => {
  let component: DashboardTecnicoComponent;
  let fixture: ComponentFixture<DashboardTecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTecnicoComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTecnicoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
