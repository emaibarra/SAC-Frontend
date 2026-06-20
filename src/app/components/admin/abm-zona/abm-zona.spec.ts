import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmZona } from './abm-zona';

describe('AbmZona', () => {
  let component: AbmZona;
  let fixture: ComponentFixture<AbmZona>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmZona],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmZona);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
