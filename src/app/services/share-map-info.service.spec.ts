import { TestBed, inject } from '@angular/core/testing';

import { ShareMapInfoService } from './share-map-info.service';

describe('ShareMapInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareMapInfoService]
    });
  });

  it('should be created', inject([ShareMapInfoService], (service: ShareMapInfoService) => {
    expect(service).toBeTruthy();
  }));
});
