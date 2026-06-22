import { TestBed } from '@angular/core/testing';

import { Problema } from './problema';

describe('Problema', () => {
  let service: Problema;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Problema);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
