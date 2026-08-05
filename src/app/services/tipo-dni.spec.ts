import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TipoDniService } from './tipo-dni.service';

describe('TipoDniService', () => {
  let service: TipoDniService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoDniService]
    });
    service = TestBed.inject(TipoDniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});