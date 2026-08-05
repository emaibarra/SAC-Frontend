import { TestBed } from '@angular/core/testing';

import { ZonaEmpresaService } from './zona-empresa';

describe('ZonaEmpresaService', () => {
  let service: ZonaEmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZonaEmpresaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
