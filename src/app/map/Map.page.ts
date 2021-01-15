import { Component, OnInit, OnDestroy } from '@angular/core';
import {Map, Icon, tileLayer, polyline, marker} from 'leaflet';
import { Timer } from '../service/timer-service/timer-service';
import { GeocalisationService } from '../service/geocalisation-service/geocalisation-service';
import { DataStorageService } from '../service/data-storage-service/data-storage-service';
import { Storage } from '@ionic/storage';
import { PhotoService } from '../service/photo-service/photo-service';
import { ToastService } from '../service/toast-service/toast-service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})

export class MapPage implements OnInit, OnDestroy {
  /**
   * map to display
   */
  private _map: Map = null;

  /**
   * if parking is started
   */
  public isStarted: boolean = false;

  /**
   * Time string to display
   */
  public timerString: String = "00:00:00";

  /**
   * Get instance timer
   */
  public timer: Timer = Timer.getInstance();

  /**
   * Set timer 
   */
  public setTimer: any;

  /**
   * Date of parking
   */
  public dateStart: Date;

  dataUrl: string

  /**
   * Geocalisation service
   */
  geocalisationService: GeocalisationService = GeocalisationService.getInstance();

    /**
   * Service to make toast
   */
  public toastService: ToastService = ToastService.getInstance();

  /**
   * Position
   */
  carPosition: { latitude: number, longitude: number };
  userPosition: { latitude: number, longitude: number };
  /**
   * Position marker
   */
  positionCarMarker: any;
  positionUserMarker: any;
  lineTraject: any

  /**
   * Watch position
   */
  watch: any;

  /**
   * Data storage service
   */
  dataStorageService: DataStorageService;

  /**
   * history is activate
   */
  isHistoryActivate: boolean

  /**
   * 
   */
  photoService = PhotoService.getInstance();


  LeafIcon = Icon.extend({
    options: {
       iconSize: [45, 45]
    }
  });
  carIcon = new this.LeafIcon({iconUrl: '../assets/icon/car.png'});
  //location-pointer
  userIcon = new this.LeafIcon({iconUrl: '../assets/icon/location-pointer.png'});


  constructor(private storage: Storage) {
    this.dataStorageService = new DataStorageService(storage);
    this.timer.setStorage(storage);
  }


  ngOnInit(): void { }

  /**
   * Method of ionic cycle
   */
  ionViewDidEnter(): void {

    if (!this._map) this.leafletMap();
    this.dataStorageService.getIsHistory().then((result) => {
      this.isHistoryActivate = result ? result : true;
    });
  }

  /**
   * Create a map and place marker
   */
  private async leafletMap() {
    await this.geocalisationService.position();

    this.carPosition = this.geocalisationService.getCurrentPosition();
    this._map =  new Map('map', { center: [this.carPosition.latitude, this.carPosition.longitude] })
      .setView([this.carPosition.latitude, this.carPosition.longitude], 10);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '<a href="http://leafletjs.com/">Leaflet</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this._map);

    this.watch = this.geocalisationService.getWatchPosition();
    this.watch.subscribe(this.updateUserPosition.bind(this));
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy(): void {

    this._map.remove();
    this.watch.unsubscribe();
  }

  /**
   * set start of saved position
   * @param startState 
   */
  private setStarted(startState: boolean): void {

    this.isStarted = startState;
    if (this.isStarted) {
      this.dataUrl = '';
      this.timer.start();
      this.setTimer = setInterval(this.updateTimer.bind(this), 100);
      // Place marker
      if(!this.positionUserMarker && this.userPosition) {
        console.log('position marker non mit')
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
      // remove layer
      this._map.removeLayer(this.positionCarMarker)
      this._map.removeLayer(this.positionUserMarker);
      this._map.removeLayer(this.lineTraject);
      this.positionCarMarker = null;
      this.positionUserMarker = null;
      this.lineTraject = null;
      //save in bdd
      if (this.isHistoryActivate) {        
        this.dataStorageService
          .setData(
            this.carPosition.latitude, this.carPosition.longitude,
            this.dateStart, this.timerString,
            this.dataUrl ? this.dataUrl: ''
          );
      }
    }

  }

  /**
   * Update timer
   */
  private updateTimer() {
    this.timerString = this.timer.displayedTime;
  }

  /**
   * Update position
   */
  private async updatePosition() {
    console.log('on update')
    await this.geocalisationService.position();

    console.log('on  a update')
    this.carPosition = this.geocalisationService.getCurrentPosition();
    console.log('on fini await')

    return Promise.resolve('Fini');
  }

  /**
   * Take photo
   */
  private async takePhoto() {
    let photo = await this.photoService.takePhoto();
    
    if(photo.dataUrl) {
      this.dataUrl = photo.dataUrl;
      this.toastService.popToast("Image Saved");

    }
  }

  /**
   * Add line of traject
   */
  public addLineTraject() {
    if(this.lineTraject) {
      this._map.removeLayer(this.lineTraject);
    }

    let latlngs = Array();

    //Get latlng from user position
    latlngs.push({ lat: this.userPosition.latitude, lng: this.userPosition.longitude });

    //Get latlng from car position
    latlngs.push({ lat: this.carPosition.latitude, lng: this.carPosition.longitude });

    // create a blue polyline from an arrays of LatLng points
    this.lineTraject = polyline(latlngs, { color: 'blue' }).addTo(this._map);

    // zoom the map to the polyline
    this._map.fitBounds(this.lineTraject.getBounds());
  }

  /**
   * Add Car Marker
   */
  public addCarMarker() {
    this.positionCarMarker = marker([this.carPosition.latitude, this.carPosition.longitude], {icon: this.carIcon})
    .addTo(this._map).bindPopup('your car is here').openPopup();
  }

  /**
   * Add user marker
   */
  public addUserMarker() {
    this.positionUserMarker = marker([this.userPosition.latitude, this.userPosition.longitude], {icon: this.userIcon})
    .addTo(this._map).bindPopup('you are here');
  }

  /**
   * Update user position
   * @param data 
   */
  private updateUserPosition(data) {
    let result = data as any;
    if (result && result.coords) {

      if(this.positionUserMarker) {
        this._map.removeLayer(this.positionUserMarker);
      }
      
      this.userPosition = { latitude: result.coords.latitude, longitude: result.coords.longitude }
      //this.userPosition = { latitude: 47.654494828509755, longitude: 7.288282344824184 }

      console.log('update position', result);
      
      this.addUserMarker();

      if(this.isStarted) this.addLineTraject();
    }
  }
}

/*
//create marker button
Leaflet.marker([28.6, 77]).addTo(this._map).bindPopup('Delhi').openPopup();
Leaflet.marker([34, 77]).addTo(this._map).bindPopup('Leh').openPopup();
*/
/*
 // create a line
 antPath([[28.644800, 77.216721], [34.1526, 77.5771]],
   { color: '#FF0000', weight: 5, opacity: 0.6 })
   .addTo(this._map);
*/