import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ParkingEntry } from '../models/parking.model';
import { AlertService } from '../services/alert.service';
import { ModalService } from '../services/modal.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBadge,
    IonContent,
    IonButton,
    IonIcon,
  ],
})
export class ListPage {
  private readonly storage = inject(StorageService);
  private readonly modal = inject(ModalService);
  private readonly alert = inject(AlertService);

  protected readonly entries = signal<ParkingEntry[]>([]);
  protected readonly historyEnabled = signal(true);

  async ionViewWillEnter(): Promise<void> {
    await this.purgeIfDue();
    await this.load();
  }

  private async purgeIfDue(): Promise<void> {
    const months = await this.storage.getDeletionFrequency();
    const anchor = await this.storage.getFrequencyAnchorDate();
    if (months > 0 && anchor) {
      const due = new Date(anchor);
      due.setMonth(due.getMonth() + months);
      if (Date.now() >= due.getTime()) {
        await this.storage.clearAllParkings();
      }
    }
  }

  private async load(): Promise<void> {
    this.historyEnabled.set(await this.storage.isHistoryEnabled());
    this.entries.set(await this.storage.getAllParkings());
  }

  protected view(entry: ParkingEntry): void {
    void this.modal.openParking(entry);
  }

  protected async rename(entry: ParkingEntry): Promise<void> {
    const name = await this.alert.promptName(entry.value.name ?? '');
    if (name === null) {
      return;
    }
    const updated: ParkingEntry = {
      key: entry.key,
      value: { ...entry.value, name },
    };
    await this.storage.updateParking(updated);
    await this.load();
  }

  protected async remove(entry: ParkingEntry): Promise<void> {
    const confirmed = await this.alert.confirm(
      'Delete parking',
      'This parking will be permanently removed.',
    );
    if (!confirmed) {
      return;
    }
    await this.storage.removeParking(entry.key);
    await this.load();
  }
}
