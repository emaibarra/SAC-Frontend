import { TestBed } from '@angular/core/testing';

import { ListaPrecioService } from './lista-precio';

describe('ListaPrecioService', () => {
  let service: ListaPrecioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaPrecioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
