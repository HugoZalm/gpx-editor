import { TestBed } from '@angular/core/testing';

import { SelectInteractionService } from './select-interaction-service';

describe('SelectInteractionService', () => {
  let service: SelectInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
