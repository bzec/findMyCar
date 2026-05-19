import { Injectable, computed, inject, signal } from '@angular/core';
import { NotificationService } from './notification.service';
import { StorageService } from './storage.service';

const pad = (value: number): string => value.toString().padStart(2, '0');

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly storage = inject(StorageService);
  private readonly notifications = inject(NotificationService);

  private startTime = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private alertHours: number | null = null;
  private alertMinutes: number | null = null;
  private alertSent = false;

  private readonly elapsedMs = signal(0);
  private readonly active = signal(false);

  /** Whether a parking timer is currently running. */
  readonly running = this.active.asReadonly();

  /** Elapsed time formatted as HH:MM:SS. */
  readonly display = computed(() => {
    const totalSeconds = Math.floor(this.elapsedMs() / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  async start(): Promise<void> {
    this.startTime = Date.now();
    this.alertSent = false;
    this.elapsedMs.set(0);
    this.active.set(true);

    const { hours, minutes } = await this.storage.getAlertDelay();
    this.alertHours = hours;
    this.alertMinutes = minutes;

    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.active.set(false);
  }

  private tick(): void {
    const diff = Date.now() - this.startTime;
    this.elapsedMs.set(diff);

    if (this.alertSent) {
      return;
    }
    const hasDelay =
      (this.alertHours ?? 0) > 0 || (this.alertMinutes ?? 0) > 0;
    if (!hasDelay) {
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours === (this.alertHours ?? 0) && minutes === (this.alertMinutes ?? 0)) {
      this.alertSent = true;
      this.notifications.notify(
        `Your car has been parked for ${pad(hours)}:${pad(minutes)}.`,
      );
    }
  }
}
