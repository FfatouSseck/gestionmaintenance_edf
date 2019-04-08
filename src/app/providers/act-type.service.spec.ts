import { TestBed } from '@angular/core/testing';

import { ActTypeService } from './act-type.service';

describe('ActTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActTypeService = TestBed.get(ActTypeService);
    expect(service).toBeTruthy();
  });
});
