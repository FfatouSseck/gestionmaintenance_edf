import { TestBed } from '@angular/core/testing';

import { DamagegroupService } from './damagegroup.service';

describe('DamagegroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DamagegroupService = TestBed.get(DamagegroupService);
    expect(service).toBeTruthy();
  });
});
