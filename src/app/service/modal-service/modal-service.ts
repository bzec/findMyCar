import { ModalController } from '@ionic/angular';
import { promise } from 'selenium-webdriver';
import { ModalParkingView } from 'src/app/modal/view-parking-modal';
/**
 * Service to create modal
 */
export class ModalService {
  /**
   * Modal controller
   */
  private _modalController: ModalController;


  constructor(modal: ModalController) {
    this._modalController = modal;
  }

  /**
   * Present modal view for item
   * @param item 
   */
  public async presentModalParkingView(item: any) : Promise<void> {
    const modal = await this._modalController.create({
      component: ModalParkingView,
      componentProps: {
        'name': item.value.name ? item.value.name : 'Missing name',
        'latitude': item.value.latitude,
        'longitude': item.value.longitude,
        'duration': item.value.duration,
        'pictureData': item.value.pictureData
      }
    });
    return await modal.present();
  }
}