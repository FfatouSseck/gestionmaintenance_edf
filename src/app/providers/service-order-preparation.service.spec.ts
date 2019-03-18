import { TestBed } from '@angular/core/testing';

import { ServiceOrderPreparationService } from './service-order-preparation.service';

describe('ServiceOrderPreparationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceOrderPreparationService = TestBed.get(ServiceOrderPreparationService);
    expect(service).toBeTruthy();
  });
});
