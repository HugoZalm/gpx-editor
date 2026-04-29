import { TestBed } from '@angular/core/testing';

import { SplitInteractionService } from './split-interaction-service';

describe('SplitInteractionService', () => {
  let service: SplitInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplitInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
