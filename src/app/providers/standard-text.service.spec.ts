import { TestBed } from '@angular/core/testing';

import { StandardTextService } from './standard-text.service';

describe('StandardTextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StandardTextService = TestBed.get(StandardTextService);
    expect(service).toBeTruthy();
  });
});
