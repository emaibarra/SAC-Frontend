import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GerenteZonasComponent } from './gerente-zonas';

describe('GerenteZonas', () => {
  let component: GerenteZonasComponent;
  let fixture: ComponentFixture<GerenteZonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteZonasComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteZonasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
