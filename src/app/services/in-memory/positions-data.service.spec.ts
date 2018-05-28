import { TestBed, inject } from '@angular/core/testing';

import { PositionsDataService } from './positions-data.service';

describe('PositionsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PositionsDataService]
    });
  });

  it('should be created', inject([PositionsDataService], (service: PositionsDataService) => {
    expect(service).toBeTruthy();
  }));
});
