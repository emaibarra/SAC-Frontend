import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmProvincia } from './abm-provincia';

describe('AbmProvincia', () => {
  let component: AbmProvincia;
  let fixture: ComponentFixture<AbmProvincia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmProvincia],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmProvincia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
