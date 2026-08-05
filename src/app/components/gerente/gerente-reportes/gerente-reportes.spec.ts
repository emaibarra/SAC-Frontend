import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GerenteReportesComponent } from './gerente-reportes';

describe('GerenteReportesComponent', () => {
  let component: GerenteReportesComponent;
  let fixture: ComponentFixture<GerenteReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteReportesComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteReportesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
