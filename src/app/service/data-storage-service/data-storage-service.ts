import { Storage } from '@ionic/storage';
import { addListener } from 'process';
import { ToastService } from '../toast-service/toast-service';

/**
 * Service to store data
 */
export class DataStorageService {

  /**
   * Storage
   */
  private _storage : Storage;

  /**
   * Service to make toast
   */
  public toastService: ToastService = ToastService.getInstance();
  
  constructor(storage:Storage) {
      this._storage = storage;
  }

  /**
   * Set date to save parking's infos
   * @param latitude 
   * @param longitude 
   * @param date 
   * @param duration 
   */
  public setData(latitude:number, longitude:number, date:Date, duration:String, pictureBase64: String) {
    let id: string = (latitude+longitude+date.getTime()).toString();

    this._storage.set(id,{latitude,longitude,date,duration , pictureBase64});
    
    this.toastService.popToast("Your emplacement is saved")
    
    this._storage.get(id).then((res)=> {
    });
  }

  /**
   * Get if user are activate history
   */
  public async getIsHistory(): Promise<boolean> {
    let val: boolean = null
    await this._storage.get('UserHistory').then((value)=>{
      val = value;
    });
    return val ? val : false;
  }

  /**
   * Get all positions
   */
  public getAllData() : Array<any> {
    let list = [];
    
    this._storage.forEach((value, key, iterationNumber) => {
      if(value && value.latitude && value.longitude) list.push({key, value});
    })

    return list;
  }

  /**
   * Remove a stored element with key
   * @param key 
   */
  public remove(key: string) :void {
    this._storage.remove(key).then(()=> {
      this.toastService.popToast('item deleted');
    });
  }


  /**
   * Edit a store
   * @param item 
   */
  public edit(item: any) : void{
    this._storage.set(item.key, item.value).then(() => {
      this.toastService.popToast('changed has saved');
    });

  }

  /**
   * Delete all data positions
   */
  public deleteAllDataPosition() : void {

    this._storage.forEach((value, key, iterationNumber) => {
      if(value && value.latitude && value.longitude) this._storage.remove(key);
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
  public async getSavedDate() {
    let date;
    await this._storage.get('UserDateFrenquency').then((value)=>{
      date = value;
    });

    return date ? date : null;
  }

  /**
   * Get frequency delete
   */
  async getFrenquencyDelete() {
    let add;
    await this._storage.get('UserFrenquency').then((value)=>{
      add = value;
    });

    return add ? add : '0';
  }

  /**
   * Get duration of parking
   */
  async getTimeAlert() {
    let hours : number;
    let minutes : number;
    
    await this._storage.get('UserAlertHours').then((value)=>{
      hours = value;
    });

    await this._storage.get('UserAlertMinutes').then((value)=>{
      minutes = value;
    });
    hours = hours ? hours : null;
    minutes = minutes ? minutes : null;

    return {hours, minutes};
  }
} 
