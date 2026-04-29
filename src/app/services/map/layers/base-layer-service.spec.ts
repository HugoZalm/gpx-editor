import { TestBed } from '@angular/core/testing';

import { BaseLayerService } from './base-layer-service';

describe('BaseLayerService', () => {
  let service: BaseLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
