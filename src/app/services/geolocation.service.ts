import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Coordinates } from '../models/parking.model';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  async getCurrentPosition(): Promise<Coordinates> {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  }

  /** Starts watching the device position. Returns a watch id. */
  watchPosition(callback: (coords: Coordinates) => void): Promise<string> {
    return Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (position) => {
        if (position) {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      },
    );
  }

  async clearWatch(id: string): Promise<void> {
    await Geolocation.clearWatch({ id });
  }
}
