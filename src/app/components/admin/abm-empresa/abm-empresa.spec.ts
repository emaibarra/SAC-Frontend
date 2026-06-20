import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmEmpresaComponent } from './abm-empresa.component';

describe('AbmEmpresaComponent', () => {
  let component: AbmEmpresaComponent;
  let fixture: ComponentFixture<AbmEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmEmpresaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
