import { TestBed } from '@angular/core/testing';

import { TcxConverterService } from './tcx-converter-service';

describe('TcxConverterService', () => {
  let service: TcxConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TcxConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
