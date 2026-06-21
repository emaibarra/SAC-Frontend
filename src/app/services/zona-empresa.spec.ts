import { TestBed } from '@angular/core/testing';

import { ZonaEmpresa } from './zona-empresa';

describe('ZonaEmpresa', () => {
  let service: ZonaEmpresa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZonaEmpresa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
