import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

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

    let res = await Geolocation.getCurrentPosition();  
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
    return Geolocation;
  }
}