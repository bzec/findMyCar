import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { ViewParkingPage } from '../modal/view-parking.page';
import { ParkingEntry } from '../models/parking.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly modalController = inject(ModalController);

  async openParking(entry: ParkingEntry): Promise<void> {
    const modal = await this.modalController.create({
      component: ViewParkingPage,
      componentProps: { entry },
    });
    await modal.present();
  }
}
