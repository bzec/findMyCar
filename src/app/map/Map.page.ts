import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import { Timer } from '../service/timer-service/timer-service';
import { GeocalisationService } from '../service/geocalisation-service/geocalisation-service';
import { DataStorageService } from '../service/data-storage-service/data-storage-service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})

export class MapPage implements OnInit, OnDestroy {
  /**
   * map to display
   */
  private _map: Leaflet.Map = null;

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
  public dateStart : Date;


  /**
   * Geocalisation service
   */
  geocalisationService: GeocalisationService = GeocalisationService.getInstance();

  /**
   * Position
   */
  currentPosition: { latitude: number, longitude: number };
  /**
   * Position marker
   */
  positionMarker: any;

  /**
   * Data storage service
   */
  dataStorageService: DataStorageService;

  /**
   * history is activate
   */
  isHistoryActivate : boolean

  constructor(private storage: Storage) {
    this.dataStorageService = new DataStorageService(storage);
    this.timer.setStorage(storage);
  }


  ngOnInit(): void {}

  /**
   * Method of ionic cycle
   */
  private ionViewDidEnter(): void {

    if (!this._map) this.leafletMap();
    this.dataStorageService.getIsHistory().then((result)=> {
      this.isHistoryActivate = result ? result : true;
    });
  }

  /**
   * Create a map and place marker
   */
  private async leafletMap() {
    await this.geocalisationService.position();

    this.currentPosition = this.geocalisationService.getCurrentPosition();
    this._map = Leaflet.map('map', {center: [this.currentPosition.latitude, this.currentPosition.longitude] })
    .setView([this.currentPosition.latitude, this.currentPosition.longitude], 10);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '<a href="http://leafletjs.com/">Leaflet</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

  }

  /** Remove map when we have multiple map object */
  ngOnDestroy(): void {

    this._map.remove();
  }

  /**
   * set start of saved position
   * @param startState 
   */
  private setStarted(startState: boolean): void {

    this.isStarted = startState;
    if (this.isStarted) {

      this.timer.start();
      this.setTimer = setInterval(this.updateTimer.bind(this), 100);
      // Place marker
      this.updatePosition().then(() => {
        this.positionMarker = Leaflet.marker([this.currentPosition.latitude, this.currentPosition.longitude])
          .addTo(this._map).bindPopup('your car is here').openPopup();
      })
      this._map.setZoom(18);
      // Date
      this.dateStart = new Date();
    } else {
      // Timer stop
      this.timer.stop();
      clearInterval(this.setTimer);
      // remove layer
      this._map.removeLayer(this.positionMarker)
      //save in bdd
      if(this.isHistoryActivate) {
        this.dataStorageService
        .setData(this.currentPosition.latitude, this.currentPosition.longitude, this.dateStart, this.timerString);
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
    await this.geocalisationService.position();

    this.currentPosition = this.geocalisationService.getCurrentPosition();
    return Promise.resolve('Fini');
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