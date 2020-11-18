import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'modal-view-item-page',
  templateUrl: 'view-item.page.html',

})
/**
 * Modal of parking infos saved
 */
export class ModalViewItemPage {
    
  // Data passed in by componentProps
  @Input() name: any;
  @Input() latitude: any;
  @Input() longitude: any;
  @Input() duration: any;
  
  constructor( private modalController: ModalController,
    private navParams: NavParams) { }

  private async closeModal() {

    await this.modalController.dismiss();
  }

}