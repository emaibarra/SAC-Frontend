import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmEmpresa } from './abm-empresa.component';

describe('AbmEmpresa', () => {
  let component: AbmEmpresa;
  let fixture: ComponentFixture<AbmEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmEmpresa],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmEmpresa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
