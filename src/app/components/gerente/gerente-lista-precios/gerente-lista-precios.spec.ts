import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GerenteListaPreciosComponent } from './gerente-lista-precios';

describe('GerenteListaPreciosComponent', () => {
  let component: GerenteListaPreciosComponent;
  let fixture: ComponentFixture<GerenteListaPreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteListaPreciosComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteListaPreciosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
