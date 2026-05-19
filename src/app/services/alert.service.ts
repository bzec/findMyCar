import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly alertController = inject(AlertController);

  async confirm(header: string, message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Confirm', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }

  async promptName(currentName: string): Promise<string | null> {
    const alert = await this.alertController.create({
      header: 'Rename parking',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: currentName,
          placeholder: 'Parking name',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Save', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role, data } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return null;
    }
    return (data?.values?.name ?? '').trim();
  }
}
