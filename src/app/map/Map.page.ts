import { Component, OnInit, OnDestroy } from '@angular/core';
import {Map, Icon, tileLayer, polyline, marker} from 'leaflet';
import { Timer } from '../service/timer-service/timer-service';
import { GeocalisationService } from '../service/geocalisation-service/geocalisation-service';
import { DataStorageService } from '../service/data-storage-service/data-storage-service';
import { Storage } from '@ionic/storage';
import { PhotoService } from '../service/photo-service/photo-service';
import { ToastService } from '../service/toast-service/toast-service';
import { NetworkService } from '../service/network-service/network-service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})

export class MapPage implements OnInit, OnDestroy {
  /**
   * map to display
   */
  private map : Map = null;

  /**
   * if parking is started
   */
  private isStarted: boolean = false;

  /**
   * Time string to display
   */
  private timerString: String = '00:00:00';

  /**
   * Get instance timer
   */
  private timer: Timer = Timer.getInstance();

  /**
   * Set timer 
   */
  private setTimer: any;

  /**
   * Date of parking
   */
  private dateStart: Date;

  private dataUrl: string

  /**
   * Geocalisation service
   */
  private geocalisationService: GeocalisationService = GeocalisationService.getInstance();

  /**
   * Service to make toast
   */
  private toastService: ToastService = ToastService.getInstance();

  /**
   * Position
   */
  private carPosition: { latitude: number, longitude: number };
  private userPosition: { latitude: number, longitude: number };
  /**
   * Position marker
   */
  private positionCarMarker: any;
  private positionUserMarker: any;
  private lineTraject: any

  /**
   * Watch position
   */
  private watch: any;

  /**
   * Data storage service
   */
  private dataStorageService: DataStorageService;

  /**
   * history is activate
   */
  private isHistoryActivate: boolean

  /**
   *  Photo service
   */
  private photoService = PhotoService.getInstance();

  LeafIcon = Icon.extend({
    options: {
       iconSize: [45, 45]
    }
  });

  private carIcon = new this.LeafIcon({iconUrl: '../assets/icon/directions_car_black.svg'});
  //location-pointer
  private userIcon = new this.LeafIcon({iconUrl: '../assets/icon/location_on_black.svg'});

  constructor(private storage: Storage, public networkService: NetworkService,
    private androidPermissions: AndroidPermissions, private platform: Platform) {
    
    this.dataStorageService = new DataStorageService(storage);
    this.timer.setStorage(storage);
    if(platform.is('android')) {
      androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );

      androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE).then(
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE)
      );
      }
  }


  ngOnInit() : void { }

  /**
   * Method of ionic cycle
   */
  ionViewDidEnter() : void {
    this.iniView();
  }

  private iniView() : void {
    if(this.networkService.isOnline()) {
      if (!this.map){
        this.leafletMap();
      }
      this.dataStorageService.getIsHistory().then((result) => {
        this.isHistoryActivate = result ? result : true;
      });
    }
  }

  /**
   * Create a map and place marker
   */
  private async leafletMap() : Promise<void> {
    await this.geocalisationService.position();

    this.carPosition = this.geocalisationService.getCurrentPosition();
    this.map =  new Map('map', { center: [this.carPosition.latitude, this.carPosition.longitude] })
      .setView([this.carPosition.latitude, this.carPosition.longitude], 10);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '<a href="http://leafletjs.com/">Leaflet</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

    this.watch = this.geocalisationService.getWatchPosition();
    this.watch.watchPosition({}, (pos, err) => {
      this.updateUserPosition(pos);
    })
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() : void {

    this.map.remove();
    this.watch.unsubscribe();
  }

  /**
   * Set start of saved position
   * @param startState 
   */
  private setStarted(startState: boolean) : void {

    this.isStarted = startState;
    if (this.isStarted) {
      this.dataUrl = '';
      this.timer.start();
      this.setTimer = setInterval(this.updateTimer.bind(this), 100);
      // Place marker
      if(!this.positionUserMarker && this.userPosition) {
        this.addUserMarker();
      }

      this.updatePosition().then(() => {
        this.addCarMarker();
        this.addLineTraject();
      });

      // Date
      this.dateStart = new Date();
    } else {
      // Timer stop
      this.timer.stop();
      clearInterval(this.setTimer);
      // Remove layer
      this.map.removeLayer(this.positionCarMarker)
      this.map.removeLayer(this.positionUserMarker);
      this.map.removeLayer(this.lineTraject);
      this.positionCarMarker = null;
      this.positionUserMarker = null;
      this.lineTraject = null;
      // Save in bdd
      this.saveInDataBase();
    }

  }

  private async saveInDataBase() : Promise<void> {
    this.isHistoryActivate = await this.dataStorageService.getIsHistory();

    if (this.isHistoryActivate) {        
      this.dataStorageService
        .setData(
          this.carPosition.latitude, this.carPosition.longitude,
          this.dateStart, this.timerString,
          this.dataUrl ? this.dataUrl: ''
        );
    }
  }

  /**
   * Update timer
   */
  private updateTimer() : void {
    this.timerString = this.timer.displayedTime;
  }

  /**
   * Update position
   */
  private async updatePosition() : Promise<void> {
    await this.geocalisationService.position();
    this.carPosition = this.geocalisationService.getCurrentPosition();
    return Promise.resolve();
  }

  /**
   * Take photo
   */
  private async takePhoto() : Promise<void> {
    let photo = await this.photoService.takePhoto();
    
    if(photo.dataUrl) {
      this.dataUrl = photo.dataUrl;
      this.toastService.popToast('Saved pictures');

    }
  }

  /**
   * Add line of traject
   */
  public addLineTraject() : void {
    if(this.lineTraject) {
      this.map.removeLayer(this.lineTraject);
    }

    let latlngs = Array();

    //Get latlng from user position
    latlngs.push({ lat: this.userPosition.latitude, lng: this.userPosition.longitude });

    //Get latlng from car position
    latlngs.push({ lat: this.carPosition.latitude, lng: this.carPosition.longitude });

    // Create a blue polyline from an arrays of LatLng points
    this.lineTraject = polyline(latlngs, { color: 'blue' }).addTo(this.map);

    // zoom the map to the polyline
    this.map.fitBounds(this.lineTraject.getBounds());
  }

  /**
   * Add car Marker
   */
  public addCarMarker() : void {
    this.positionCarMarker = marker([this.carPosition.latitude, this.carPosition.longitude], {icon: this.carIcon})
    .addTo(this.map).bindPopup('your car is here').openPopup();
  }

  /**
   * Add user marker
   */
  public addUserMarker() : void {
    this.positionUserMarker = marker([this.userPosition.latitude, this.userPosition.longitude], {icon: this.userIcon})
    .addTo(this.map).bindPopup('you are here');
  }

  /**
   * Update user position
   * @param data 
   */
  private updateUserPosition(data) : void {
    let result = data as any;
    if (result && result.coords) {

      if(this.positionUserMarker) {
        this.map.removeLayer(this.positionUserMarker);
      }
      
      this.userPosition = { latitude: result.coords.latitude, longitude: result.coords.longitude }
      this.addUserMarker();

      if(this.isStarted) this.addLineTraject();
    }
  }
}