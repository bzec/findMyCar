import { ModalController } from '@ionic/angular';
import { ModalViewItemPage } from 'src/app/modal/view-item-modal';
/**
 * Service to create modal
 */
export class ModalService {
  /**
   * modal controller
   */
  private _modalController: ModalController;


  constructor(modal: ModalController) {
    this._modalController = modal;
  }

  /**
   * Present modal view for item
   * @param item 
   */
  public async presentModalViewItem(item: any) {
    const modal = await this._modalController.create({
      component: ModalViewItemPage,
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