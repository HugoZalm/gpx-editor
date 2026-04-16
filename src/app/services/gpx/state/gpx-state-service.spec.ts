import { TestBed } from '@angular/core/testing';

import { GpxStateService } from './gpx-state-service';

describe('GpxStateService', () => {
  let service: GpxStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpxStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
