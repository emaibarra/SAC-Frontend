import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenteProblemas } from './gerente-problemas';

describe('GerenteProblemas', () => {
  let component: GerenteProblemas;
  let fixture: ComponentFixture<GerenteProblemas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteProblemas],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenteProblemas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
