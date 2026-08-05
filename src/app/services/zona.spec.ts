import { TestBed } from '@angular/core/testing';
// Importamos esto por si ZonaService hace peticiones HTTP
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { ZonaService } from './zona.service';

describe('ZonaService', () => {
  let service: ZonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ZonaService]
    });
    service = TestBed.inject(ZonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});