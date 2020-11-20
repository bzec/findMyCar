import { ToastController } from '@ionic/angular';

/**
 * Service to make toast
 */
export class ToastService {
  private static instance: ToastService
  toastController: ToastController = new ToastController();
  constructor() { }

  /**
   * Singleton
   */
  public static getInstance(): ToastService {

    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }

    return ToastService.instance;
  }
  /**
   * pop toast
   * @param message 
   */
  public async popToast(message: string) {
    const toast = await this.toastController.create({
      message,
      animated: true,
      duration: 2000,
      position: "top"
    });
    toast.present();
  }
}