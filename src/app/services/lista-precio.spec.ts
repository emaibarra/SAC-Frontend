import { TestBed } from '@angular/core/testing';

import { ListaPrecio } from './lista-precio';

describe('ListaPrecio', () => {
  let service: ListaPrecio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaPrecio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
