import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClienteDashboard } from './cliente-dashboard';

describe('ClienteDashboard', () => {
  let component: ClienteDashboard;
  let fixture: ComponentFixture<ClienteDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteDashboard],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
