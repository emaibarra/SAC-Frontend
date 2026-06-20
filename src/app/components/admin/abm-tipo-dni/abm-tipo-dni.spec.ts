import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmTipoDni } from './abm-tipo-dni';

describe('AbmTipoDni', () => {
  let component: AbmTipoDni;
  let fixture: ComponentFixture<AbmTipoDni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmTipoDni],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmTipoDni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
