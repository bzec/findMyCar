import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { StorageService } from './storage.service';
import { TimerService } from './timer.service';

describe('TimerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StorageService,
          useValue: {
            getAlertDelay: async () => ({ hours: null, minutes: null }),
          },
        },
        {
          provide: NotificationService,
          useValue: { notify: () => undefined },
        },
      ],
    });
  });

  it('starts idle at zero', () => {
    const timer = TestBed.inject(TimerService);
    expect(timer.running()).toBe(false);
    expect(timer.display()).toBe('00:00:00');
  });

  it('is running after start and idle after stop', async () => {
    const timer = TestBed.inject(TimerService);

    await timer.start();
    expect(timer.running()).toBe(true);

    timer.stop();
    expect(timer.running()).toBe(false);
  });
});
