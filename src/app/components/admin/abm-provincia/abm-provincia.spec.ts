import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmProvinciaComponent } from './abm-provincia.component';

describe('AbmProvinciaComponent', () => {
  let component: AbmProvinciaComponent;
  let fixture: ComponentFixture<AbmProvinciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmProvinciaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmProvinciaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
