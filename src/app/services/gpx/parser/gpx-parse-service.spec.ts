import { TestBed } from '@angular/core/testing';

import { GpxParseService } from './gpx-parse-service';

describe('GpxParseService', () => {
  let service: GpxParseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpxParseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
