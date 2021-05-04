import { Component, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastService } from '../service/toast-service/toast-service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'modal-parking-view',
  templateUrl: 'view-parking.page.html',

})
/**
 * Modal of parking infos saved
 */
export class ModalParkingView {
    
  // Data passed with componentProps
  @Input() name: string;
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() duration: string;
  @Input() pictureData : string;
  
  /**
   * Service to make toast
   */
  private toastService: ToastService = ToastService.getInstance();
  
  constructor( private modalController: ModalController, private clipboard: Clipboard,
    private platform: Platform, private navParams: NavParams) { }

  private async closeModal() : Promise<void>{

    await this.modalController.dismiss();
  }

  private copyGeolocationinfos() : void {
    //location infos copy + toast to confirmed
    this.clipboard.copy(`${this.latitude},${this.longitude}`);
    this.toastService.popToast('informations copied');
  }

  private async openInMap() : Promise<void> {
    //location open in maps
    let destination = `${this.latitude},${this.longitude}`;

    if(this.platform.is('ios')){
	    window.open('maps:\/\/?q=' + destination, '_system');
    } else if(this.platform.is('android')) {
	    let label = encodeURI('Parking position');
	    window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    } else {
      this.toastService.popToast('your platform is not compatible');

    }
  }

}