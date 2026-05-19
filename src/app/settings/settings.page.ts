import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AlertService } from '../services/alert.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonText,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonInput,
    IonButton,
    IonIcon,
  ],
})
export class SettingsPage {
  private readonly storage = inject(StorageService);
  private readonly alert = inject(AlertService);
  private readonly toast = inject(ToastService);

  protected frequency = '0';
  protected historyEnabled = true;
  protected hours: number | null = null;
  protected minutes: number | null = null;

  async ionViewWillEnter(): Promise<void> {
    this.frequency = String(await this.storage.getDeletionFrequency());
    this.historyEnabled = await this.storage.isHistoryEnabled();
    const delay = await this.storage.getAlertDelay();
    this.hours = delay.hours;
    this.minutes = delay.minutes;
  }

  protected async onFrequencyChange(value: string): Promise<void> {
    this.frequency = value;
    await this.storage.setDeletionFrequency(parseInt(value, 10));
    await this.toast.show('Deletion frequency updated');
  }

  protected async onHistoryChange(enabled: boolean): Promise<void> {
    if (!enabled) {
      const confirmed = await this.alert.confirm(
        'Disable history',
        'This will delete every saved parking. Continue?',
      );
      if (!confirmed) {
        this.historyEnabled = true;
        return;
      }
      await this.storage.clearAllParkings();
    }
    this.historyEnabled = enabled;
    await this.storage.setHistoryEnabled(enabled);
  }

  protected async onHoursChange(value: unknown): Promise<void> {
    this.hours = this.toNumber(value);
    await this.storage.setAlertHours(this.hours);
  }

  protected async onMinutesChange(value: unknown): Promise<void> {
    this.minutes = this.toNumber(value);
    await this.storage.setAlertMinutes(this.minutes);
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  protected async clearList(): Promise<void> {
    const confirmed = await this.alert.confirm(
      'Clear parking list',
      'All saved parkings will be permanently removed.',
    );
    if (!confirmed) {
      return;
    }
    await this.storage.clearAllParkings();
    await this.toast.show('Parking list cleared');
  }

  protected async clearAll(): Promise<void> {
    const confirmed = await this.alert.confirm(
      'Reset the app',
      'This erases all parkings and settings. Continue?',
    );
    if (!confirmed) {
      return;
    }
    await this.storage.clearEverything();
    this.frequency = '0';
    this.historyEnabled = true;
    this.hours = null;
    this.minutes = null;
    await this.toast.show('All app data cleared');
  }
}
