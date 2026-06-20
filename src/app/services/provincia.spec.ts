import { TestBed } from '@angular/core/testing';

import { Provincia } from './provincia';

describe('Provincia', () => {
  let service: Provincia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Provincia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
