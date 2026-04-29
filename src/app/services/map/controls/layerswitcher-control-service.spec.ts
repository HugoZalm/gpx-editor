import { TestBed } from '@angular/core/testing';

import { LayerswitcherControlService } from './layerswitcher-control-service';

describe('LayerswitcherControlService', () => {
  let service: LayerswitcherControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayerswitcherControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
