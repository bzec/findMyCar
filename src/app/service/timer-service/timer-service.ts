import { DataStorageService } from '../data-storage-service/data-storage-service';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

const localNotifications: LocalNotifications = new LocalNotifications();
/**
 * Service for timer
 */
export class Timer {

  private static instance: Timer;

  /**
   * start time 
   */
  private _startTime: number;
  /**
   * current time
   */
  private _timeNow: number;
  /**
   * set timer
   */
  private _setTimer: any;
  /**
   * Displayed time
   */
  public displayedTime: String;
  /**
   * hours and minutes
   */
  private _h: number;
  private _m: number;

  /**
   * Service to store data
   */
  public dataStorageService: DataStorageService;

  /**
   * is notif is send
   */
  isSendNotif: boolean;

  constructor() {
  }
  /**
   * Singleton
   */
  public static getInstance() : Timer {

    if (!Timer.instance) {
      Timer.instance = new Timer();
    }

    return Timer.instance;
  }

  /**
   * Start timer
   */
  public start() : void {

    this._startTime = Date.now();
    this.dataStorageService.getTimeAlert().then((time) => {
      this._h = time.hours ? time.hours : 0;
      this._m = time.minutes ? time.minutes : 0;

      if (this._h == 0 && this._m == 0) {
        this._h = this._m = null;
      }
    });
    this.isSendNotif = false;
    this._setTimer = setInterval(this.updateTime.bind(this), 100);

  }

  /**
   * Update timer
   */
  private updateTime() : void {
    this._timeNow = Date.now();
    let diffTimer: number = this._timeNow - this._startTime;
    this.displayedTime = this.timeToDisplay(new Date(diffTimer));
  }



  /**
   * Time to display
   * @param tm 
   */
  private timeToDisplay(tm: Date) : String {
    let vMin = tm.getMinutes();
    let vSec = tm.getSeconds();
    let vHours = tm.getHours() - 1;

    let hours: string = vHours.toString();
    let min: String = vMin.toString();
    let sec: String = vSec.toString();

    if (vHours < 10) {
      hours = '0' + vHours;
    }

    if (vMin < 10) {
      min = '0' + vMin.toString();
    }

    if (vSec < 10) {
      sec = '0' + vSec;
    }

    // verify is we send notif to user
    if (this._h != null && this._m != null && !this.isSendNotif) {

      if (this._h == vHours && this._m == vMin) {

        this.isSendNotif = true;
        localNotifications.schedule({
          id: 1,
          text: `you are parked since ${hours}:${min}:${sec}`
        });

      }
    }

    return `${hours}:${min}:${sec}`;
  }

  /**
   * Stop timer
   */
  public stop() : void {

    clearInterval(this._setTimer);
    this._startTime = null;
    this._timeNow = null;
    this._setTimer = null;
  }

  /**
   * Set storage
   * @param storage 
   */
  public setStorage(storage: Storage) : void {
    this.dataStorageService = new DataStorageService(storage);
  }
}