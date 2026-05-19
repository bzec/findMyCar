import { Component, OnDestroy, inject, signal } from '@angular/core';
import {
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Coordinates, ParkingValue } from '../models/parking.model';
import { GeolocationService } from '../services/geolocation.service';
import { NetworkService } from '../services/network.service';
import { NotificationService } from '../services/notification.service';
import { PhotoService } from '../services/photo.service';
import { StorageService } from '../services/storage.service';
import { TimerService } from '../services/timer.service';
import { ToastService } from '../services/toast.service';

const carIcon = L.icon({
  iconUrl: 'assets/icon/directions_car_black.svg',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const userIcon = L.icon({
  iconUrl: 'assets/icon/location_on_black.svg',
  iconSize: [44, 44],
  iconAnchor: [22, 44],
});

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonChip,
    IonLabel,
  ],
})
export class MapPage implements OnDestroy {
  private readonly geolocation = inject(GeolocationService);
  private readonly photoService = inject(PhotoService);
  private readonly storage = inject(StorageService);
  private readonly notifications = inject(NotificationService);
  private readonly toast = inject(ToastService);
  protected readonly network = inject(NetworkService);
  protected readonly timer = inject(TimerService);

  protected readonly locating = signal(true);
  protected readonly userPosition = signal<Coordinates | null>(null);
  protected readonly photoTaken = signal(false);

  private map: L.Map | null = null;
  private carMarker: L.Marker | null = null;
  private userMarker: L.Marker | null = null;
  private routeLine: L.Polyline | null = null;
  private watchId: string | null = null;

  private carPosition: Coordinates | null = null;
  private parkedAt: Date | null = null;
  private photoData: string | undefined;

  ionViewDidEnter(): void {
    if (!this.map) {
      void this.initMap();
    }
  }

  ngOnDestroy(): void {
    this.stopWatching();
    this.map?.remove();
    this.map = null;
  }

  private async initMap(): Promise<void> {
    this.locating.set(true);
    try {
      const start = await this.geolocation.getCurrentPosition();
      this.userPosition.set(start);

      this.map = L.map('map', { zoomControl: false }).setView(
        [start.latitude, start.longitude],
        16,
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map);

      this.watchId = await this.geolocation.watchPosition((coords) => {
        this.userPosition.set(coords);
        this.renderRoute();
      });
    } catch {
      await this.toast.show('Unable to access your location');
    } finally {
      this.locating.set(false);
    }
  }

  protected async startParking(): Promise<void> {
    const position = this.userPosition();
    if (!position || !this.map) {
      return;
    }
    await this.notifications.requestPermission();

    this.carPosition = position;
    this.parkedAt = new Date();
    this.photoData = undefined;
    this.photoTaken.set(false);

    await this.timer.start();
    this.renderRoute();
    this.map.setView([position.latitude, position.longitude], 17);
  }

  protected async stopParking(): Promise<void> {
    this.timer.stop();
    const duration = this.timer.display();
    await this.saveParking(duration);

    this.clearRoute();
    this.carPosition = null;
    this.parkedAt = null;
    this.photoData = undefined;
    this.photoTaken.set(false);
  }

  protected async takePhoto(): Promise<void> {
    try {
      const dataUrl = await this.photoService.takePhoto();
      if (dataUrl) {
        this.photoData = dataUrl;
        this.photoTaken.set(true);
        await this.toast.show('Photo attached to this parking');
      }
    } catch {
      await this.toast.show('Could not capture a photo');
    }
  }

  protected reloadPage(): void {
    window.location.reload();
  }

  private async saveParking(duration: string): Promise<void> {
    if (!this.carPosition || !this.parkedAt) {
      return;
    }
    const historyEnabled = await this.storage.isHistoryEnabled();
    if (!historyEnabled) {
      await this.toast.show('History is disabled — parking not saved');
      return;
    }
    const value: ParkingValue = {
      latitude: this.carPosition.latitude,
      longitude: this.carPosition.longitude,
      date: this.parkedAt.toISOString(),
      duration,
      pictureData: this.photoData,
    };
    await this.storage.saveParking(value);
  }

  private renderRoute(): void {
    if (!this.map || !this.timer.running()) {
      return;
    }
    const user = this.userPosition();
    const car = this.carPosition;
    if (!user || !car) {
      return;
    }

    const userLatLng: L.LatLngExpression = [user.latitude, user.longitude];
    const carLatLng: L.LatLngExpression = [car.latitude, car.longitude];

    if (this.carMarker) {
      this.carMarker.setLatLng(carLatLng);
    } else {
      this.carMarker = L.marker(carLatLng, { icon: carIcon })
        .addTo(this.map)
        .bindPopup('Your car is here');
    }

    if (this.userMarker) {
      this.userMarker.setLatLng(userLatLng);
    } else {
      this.userMarker = L.marker(userLatLng, { icon: userIcon })
        .addTo(this.map)
        .bindPopup('You are here');
    }

    if (this.routeLine) {
      this.routeLine.setLatLngs([userLatLng, carLatLng]);
    } else {
      this.routeLine = L.polyline([userLatLng, carLatLng], {
        color: '#3b6cf6',
        weight: 4,
        dashArray: '8 8',
      }).addTo(this.map);
    }
    this.map.fitBounds(this.routeLine.getBounds(), { padding: [60, 60] });
  }

  private clearRoute(): void {
    if (!this.map) {
      return;
    }
    for (const layer of [this.carMarker, this.userMarker, this.routeLine]) {
      if (layer) {
        this.map.removeLayer(layer);
      }
    }
    this.carMarker = null;
    this.userMarker = null;
    this.routeLine = null;
  }

  private stopWatching(): void {
    if (this.watchId) {
      void this.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}
