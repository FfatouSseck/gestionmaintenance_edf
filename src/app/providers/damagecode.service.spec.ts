import { TestBed } from '@angular/core/testing';

import { DamagecodeService } from './damagecode.service';

describe('DamagecodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DamagecodeService = TestBed.get(DamagecodeService);
    expect(service).toBeTruthy();
  });
});
