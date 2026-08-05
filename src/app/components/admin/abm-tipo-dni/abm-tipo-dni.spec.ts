import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AbmTipoDniComponent } from './abm-tipo-dni';

describe('AbmTipoDniComponent', () => {
  let component: AbmTipoDniComponent;
  let fixture: ComponentFixture<AbmTipoDniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmTipoDniComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AbmTipoDniComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
