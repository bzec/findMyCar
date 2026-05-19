import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private get supported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  async requestPermission(): Promise<void> {
    if (this.supported && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  notify(body: string): void {
    if (this.supported && Notification.permission === 'granted') {
      new Notification('Find My Car', { body });
    }
  }
}
