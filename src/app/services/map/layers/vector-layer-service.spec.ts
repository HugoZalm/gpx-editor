import { TestBed } from '@angular/core/testing';

import { VectorLayerService } from './vector-layer-service';

describe('VectorLayerService', () => {
  let service: VectorLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VectorLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
