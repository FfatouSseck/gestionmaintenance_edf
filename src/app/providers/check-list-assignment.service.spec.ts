import { TestBed } from '@angular/core/testing';

import { CheckListAssignmentService } from './check-list-assignment.service';

describe('CheckListAssignmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckListAssignmentService = TestBed.get(CheckListAssignmentService);
    expect(service).toBeTruthy();
  });
});
