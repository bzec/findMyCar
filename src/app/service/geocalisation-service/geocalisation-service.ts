import { Geolocation } from '@ionic-native/geolocation/ngx';

/**
 * Geocalisation service
 */
export class  GeocalisationService {
    private static instance : GeocalisationService;

    /**
     * Current position 
     */
    public currentPosition : any ;
    private geolocation : Geolocation = new Geolocation();

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

        await this.geolocation.getCurrentPosition().then((resp) => {
            this.currentPosition = {latitude: resp.coords.latitude , longitude:resp.coords.longitude}
            this.currentPosition.latitude = resp.coords.latitude;
            this.currentPosition.longitude = resp.coords.longitude;
            return Promise.resolve('fini');
        }).catch((error) => {
             return Promise.resolve('err');

        });

    }

    /**
     * Get current position
     */
    public getCurrentPosition() {
        return this.currentPosition;
    }
  }