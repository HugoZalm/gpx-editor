import { TestBed } from '@angular/core/testing';

import { FitConverterService } from './fit-converter-service';

describe('FitConverterService', () => {
  let service: FitConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
