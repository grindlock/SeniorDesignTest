import { TestBed } from '@angular/core/testing';

import { BleResolverService } from './ble-resolver.service';

describe('BleResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BleResolverService = TestBed.get(BleResolverService);
    expect(service).toBeTruthy();
  });
});
