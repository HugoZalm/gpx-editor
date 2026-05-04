import { TestBed } from '@angular/core/testing';

import { GpxConverterService } from './gpx-converter-service';

describe('GpxConverterService', () => {
  let service: GpxConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpxConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
