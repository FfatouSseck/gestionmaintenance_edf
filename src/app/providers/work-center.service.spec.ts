import { TestBed } from '@angular/core/testing';

import { WorkCenterService } from './work-center.service';

describe('WorkCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkCenterService = TestBed.get(WorkCenterService);
    expect(service).toBeTruthy();
  });
});
