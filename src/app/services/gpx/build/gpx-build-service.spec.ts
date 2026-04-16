import { TestBed } from '@angular/core/testing';

import { GpxBuildService } from './gpx-build-service';

describe('GpxBuildService', () => {
  let service: GpxBuildService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpxBuildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
