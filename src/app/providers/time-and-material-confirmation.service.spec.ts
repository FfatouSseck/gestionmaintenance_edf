import { TestBed } from '@angular/core/testing';

import { TimeAndMaterialConfirmationService } from './time-and-material-confirmation.service';

describe('TimeAndMaterialConfirmationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeAndMaterialConfirmationService = TestBed.get(TimeAndMaterialConfirmationService);
    expect(service).toBeTruthy();
  });
});
