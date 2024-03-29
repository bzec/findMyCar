import { Storage } from '@ionic/storage';
import { promise } from 'selenium-webdriver';
import { ToastService } from '../toast-service/toast-service';

/**
 * Service to store data
 */
export class DataStorageService {

  /**
   * Storage
   */
  private _storage: Storage;

  /**
   * Service to make toast
   */
  public toastService: ToastService = ToastService.getInstance();

  constructor(storage: Storage) {
    this._storage = storage;
  }

  /**
   * Set date to save parking's infos
   * @param latitude 
   * @param longitude 
   * @param date 
   * @param duration 
   */
  public setData(latitude: number, longitude: number, date: Date, duration: String, pictureData: String) : void {
    let id: string = (latitude + longitude + date.getTime()).toString();

    this._storage.set(id, { latitude, longitude, date, duration, pictureData });

    this.toastService.popToast("Your emplacement is saved");

    this._storage.get(id).then((res) => {
    });
  }

  /**
   * Get if user are activate history
   */
  public async getIsHistory() : Promise<boolean> {
    let val: boolean = null
    val = await this._storage.get('UserHistory');
    return val !== null ? val : true;
  }

  /**
   * Get all positions
   */
  public getAllData() : Array<any> {
    let list = [];

    this._storage.forEach((value, key, iterationNumber) => {
      if (value && value.latitude && value.longitude) list.push({ key, value });
    })
    return list;
  }

  /**
   * Remove a stored element with key
   * @param key 
   */
  public remove(key: string) : void {
    this._storage.remove(key).then(() => {
      this.toastService.popToast('Deleted');
    });
  }


  /**
   * Edit a storage element
   * @param item 
   */
  public edit(item: any) : void {
    this._storage.set(item.key, item.value).then(() => {
      this.toastService.popToast('Changed has saved');
    });

  }

  /**
   * Delete all data positions
   */
  public deleteAllDataPosition() : void {

    this._storage.forEach((value, key, iterationNumber) => {
      if (value && value.latitude && value.longitude) this._storage.remove(key);
    })
  }

  /**
   * Clear all data
   */
  public clear() : void {
    this._storage.clear();
  }

  /**
   * Get data of start frequency delete
   */
  public async getSavedDate() : Promise<any>{
    let date;
    date = await this._storage.get('UserDateFrenquency');
    return date ? date : null;
  }

  /**
   * Get frequency delete
   */
  async getFrenquencyDelete() : Promise<any> {
    let add;
    add = await this._storage.get('UserFrenquency');
    return add ? add : '0';
  }

  /**
   * Get duration of parking
   */
  async getTimeAlert() : Promise<{hours,minutes}> {
    let hours: number;
    let minutes: number;

    await this._storage.get('UserAlertHours').then((value) => {
      hours = value;
    });

    await this._storage.get('UserAlertMinutes').then((value) => {
      minutes = value;
    });
    hours = hours ? hours : null;
    minutes = minutes ? minutes : null;

    return { hours, minutes };
  }
} 
