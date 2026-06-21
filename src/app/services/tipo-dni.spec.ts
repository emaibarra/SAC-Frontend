import { TestBed } from '@angular/core/testing';

import { TipoDni } from './tipo-dni.';

describe('TipoDni', () => {
  let service: TipoDni;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDni);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
