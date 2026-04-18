import { TestBed } from '@angular/core/testing';

import { GpxUtilsService } from './gpx-utils-service';

describe('GpxUtilsService', () => {
  let service: GpxUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpxUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
