import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertDelay, ParkingEntry, ParkingValue } from '../models/parking.model';
import { ToastService } from './toast.service';

/**
 * Storage keys. The "Frenquency" spelling is kept intentionally so that data
 * saved by previous versions of the app stays readable.
 */
const KEY = {
  history: 'UserHistory',
  frequency: 'UserFrenquency',
  frequencyDate: 'UserDateFrenquency',
  alertHours: 'UserAlertHours',
  alertMinutes: 'UserAlertMinutes',
} as const;

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage = inject(Storage);
  private readonly toast = inject(ToastService);
  private readonly ready: Promise<void>;

  constructor() {
    this.ready = this.storage.create().then(() => undefined);
  }

  async isHistoryEnabled(): Promise<boolean> {
    await this.ready;
    const value = await this.storage.get(KEY.history);
    return value === null || value === undefined ? true : !!value;
  }

  async setHistoryEnabled(enabled: boolean): Promise<void> {
    await this.ready;
    await this.storage.set(KEY.history, enabled);
  }

  async getDeletionFrequency(): Promise<number> {
    await this.ready;
    const value = await this.storage.get(KEY.frequency);
    return value ? parseInt(value, 10) : 0;
  }

  async setDeletionFrequency(months: number): Promise<void> {
    await this.ready;
    await this.storage.set(KEY.frequency, String(months));
    await this.storage.set(KEY.frequencyDate, new Date().toISOString());
  }

  async getFrequencyAnchorDate(): Promise<Date | null> {
    await this.ready;
    const value = await this.storage.get(KEY.frequencyDate);
    return value ? new Date(value) : null;
  }

  async getAlertDelay(): Promise<AlertDelay> {
    await this.ready;
    const hours = await this.storage.get(KEY.alertHours);
    const minutes = await this.storage.get(KEY.alertMinutes);
    return {
      hours: hours ?? null,
      minutes: minutes ?? null,
    };
  }

  async setAlertHours(hours: number | null): Promise<void> {
    await this.ready;
    await this.storage.set(KEY.alertHours, hours);
  }

  async setAlertMinutes(minutes: number | null): Promise<void> {
    await this.ready;
    await this.storage.set(KEY.alertMinutes, minutes);
  }

  /** Persists a parking entry and returns its generated key. */
  async saveParking(value: ParkingValue): Promise<string> {
    await this.ready;
    const key = `parking-${value.date}`;
    await this.storage.set(key, value);
    await this.toast.show('Parking location saved');
    return key;
  }

  async getAllParkings(): Promise<ParkingEntry[]> {
    await this.ready;
    const entries: ParkingEntry[] = [];
    await this.storage.forEach((value: ParkingValue, key: string) => {
      if (value && value.latitude != null && value.longitude != null) {
        entries.push({ key, value });
      }
    });
    return entries.sort((a, b) => b.value.date.localeCompare(a.value.date));
  }

  async updateParking(entry: ParkingEntry): Promise<void> {
    await this.ready;
    await this.storage.set(entry.key, entry.value);
  }

  async removeParking(key: string): Promise<void> {
    await this.ready;
    await this.storage.remove(key);
    await this.toast.show('Parking deleted');
  }

  async clearAllParkings(): Promise<void> {
    await this.ready;
    const keys: string[] = [];
    await this.storage.forEach((value: ParkingValue, key: string) => {
      if (value && value.latitude != null && value.longitude != null) {
        keys.push(key);
      }
    });
    await Promise.all(keys.map((key) => this.storage.remove(key)));
  }

  async clearEverything(): Promise<void> {
    await this.ready;
    await this.storage.clear();
  }
}
