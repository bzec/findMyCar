import { TestBed } from '@angular/core/testing';
import { NetworkService } from './network.service';

describe('NetworkService', () => {
  it('reflects the initial navigator.onLine value', () => {
    const service = TestBed.inject(NetworkService);
    expect(service.isOnline()).toBe(navigator.onLine);
  });

  it('updates when the browser goes offline and back online', () => {
    const service = TestBed.inject(NetworkService);

    window.dispatchEvent(new Event('offline'));
    expect(service.isOnline()).toBe(false);

    window.dispatchEvent(new Event('online'));
    expect(service.isOnline()).toBe(true);
  });
});
