import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AbmZonaComponent } from './abm-zona';

describe('AbmZonaComponent', () => {
  let component: AbmZonaComponent;
  let fixture: ComponentFixture<AbmZonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmZonaComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AbmZonaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
