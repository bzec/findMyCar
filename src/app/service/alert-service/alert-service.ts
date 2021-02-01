import { AlertController } from '@ionic/angular';
/**
 * Service to alert user
 */
export class AlertService {
  private static instance: AlertService
  alertController: AlertController = new AlertController();
  constructor() { }

  /**
   * Singlenton
   */
  public static getInstance(): AlertService {

    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }

    return AlertService.instance;
  }

  /**
   * Alert with yes/no proposition
   * @param message 
   * @param subHeader 
   */
  public async alertYesNO(message: string, subHeader: string) {
    const alert = await this.alertController.create({
      header: 'Warning',
      subHeader: subHeader,
      message,
      animated: true,
      buttons: [
        { role: 'no', text: 'no' },
        { role: 'yes', text: 'yes' }
      ]
    });

    await alert.present();
    return alert;

  }

  /**
   * Alert with input 
   * @param message 
   * @param item 
   */
  public async alertInputs(message: string, item: any) {
    const alert = await this.alertController.create({
      header: 'Edit Name position',
      //subHeader: 'Parking name would be edited',
      message,
      animated: true,
      buttons: [
        { role: 'Cancel', text: 'Cancel' },
        { role: 'ok', text: 'Ok' }
      ],
      inputs: [
        { name: item.name ? item.name : '', placeholder: 'Name' }
      ]
    });

    await alert.present();
    return alert;
  }

}