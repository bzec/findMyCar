import { DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { ParkingEntry } from '../models/parking.model';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-view-parking',
  templateUrl: './view-parking.page.html',
  styleUrls: ['./view-parking.page.scss'],
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonFooter,
    IonIcon,
    IonImg,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
  ],
})
export class ViewParkingPage {
  @Input({ required: true }) entry!: ParkingEntry;

  private readonly modalController = inject(ModalController);
  private readonly toast = inject(ToastService);

  get coordinates(): string {
    return `${this.entry.value.latitude.toFixed(6)}, ${this.entry.value.longitude.toFixed(6)}`;
  }

  close(): void {
    void this.modalController.dismiss();
  }

  async copyCoordinates(): Promise<void> {
    const text = `${this.entry.value.latitude},${this.entry.value.longitude}`;
    try {
      await navigator.clipboard.writeText(text);
      await this.toast.show('Coordinates copied to clipboard');
    } catch {
      await this.toast.show('Clipboard is not available');
    }
  }

  openInMap(): void {
    const { latitude, longitude } = this.entry.value;
    const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`;
    window.open(url, '_blank', 'noopener');
  }
}
