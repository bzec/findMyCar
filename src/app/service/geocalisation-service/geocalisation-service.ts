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
  public static getInstance() : GeocalisationService {

    if (!GeocalisationService.instance) {
      GeocalisationService.instance = new GeocalisationService();
    }

    return GeocalisationService.instance;
  }

  /**
   * Get position
   */
  public async position() : Promise<any> {

    let res = await this.geolocation.getCurrentPosition({ timeout: 2500, maximumAge: Infinity });
    this.currentPosition = { latitude: res.coords.latitude, longitude: res.coords.longitude };
    return this.currentPosition;
  }

  /**
   * Get current position
   */
  public getCurrentPosition() : any {
    return this.currentPosition;
  }

  /**
   * Watch position
   */
  public getWatchPosition() : any {
    return this.geolocation.watchPosition();
  }
}