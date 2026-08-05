import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GerenteProblemasComponent } from './gerente-problemas';

describe('GerenteProblemasComponent', () => {
  let component: GerenteProblemasComponent;
  let fixture: ComponentFixture<GerenteProblemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteProblemasComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteProblemasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
