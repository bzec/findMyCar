import { Geolocation } from '@ionic-native/geolocation/ngx';

/**
 * Geocalisation service
 */
export class GeocalisationService {
  private static instance: GeocalisationService;

  /**
   * Current position 
   */
  public currentPosition: any;
  public userPosition: any;
  private geolocation: Geolocation = new Geolocation();

  constructor() {
  }

  /**
   * Singleton
   */
  public static getInstance(): GeocalisationService {

    if (!GeocalisationService.instance) {
      GeocalisationService.instance = new GeocalisationService();
    }

    return GeocalisationService.instance;
  }

  /**
   * Get position
   */
  public async position() {

    await this.geolocation.getCurrentPosition({timeout: 1000, maximumAge: Infinity}).then((resp) => {
      console.log('result :', resp);
      this.currentPosition = { latitude: resp.coords.latitude, longitude: resp.coords.longitude };
      return Promise.resolve('fini');
    }).catch((error) => {
      console.log(error);
      return Promise.resolve('err');
    });

  }

  /**
   * Get current position
   */
  public getCurrentPosition() {
    return this.currentPosition;
  }

  /**
   * Watch position
   */
  public getWatchPosition(): any {
    return this.geolocation.watchPosition();
  }
}