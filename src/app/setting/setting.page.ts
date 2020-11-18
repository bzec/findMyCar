import { Component } from '@angular/core';
import { DataStorageService } from '../service/data-storage-service/data-storage-service';
import { Storage } from '@ionic/storage';
import { AlertService } from '../service/alert-service/alert-service';

@Component({
  selector: 'app-setting',
  templateUrl: 'setting.page.html',
  styleUrls: ['setting.page.scss']
})

/**
 * Setting page
 */
export class SettingPage {
  /**
   * options of user
   */
  public isHistory: boolean = true;

  public frequency: string = '0'

  public timeBeforeAlert: number = 0;

  public minutes : number;
  public hours : number;
  /** Service */
  public dataStorageService: DataStorageService;

  public alertService: AlertService = AlertService.getInstance();

  constructor(storage: Storage) {
    this.dataStorageService = new DataStorageService(storage);
  }

  /**
   * Clear option
   */
  private clear() {
    this.minutes = null;
    this.hours = null;
    this.frequency = '0';
    this.isHistory = true;
  }

  /**
   * Methode of cycle ionic
   */
  private async ionViewWillEnter() {

    let userTime = await this.dataStorageService.getTimeAlert();
    this.minutes = userTime.minutes;
    this.hours = userTime.hours;
    
    let frenq = await this.dataStorageService.getFrenquencyDelete();
    this.frequency = frenq;
    
    let history = await this.dataStorageService.getIsHistory();
    this.isHistory = history;
  }

  /**
   * Change frenquency
   * @param value 
   */
  changeFrenquency(value: string) {
    this.dataStorageService.edit({ key: 'UserFrenquency', value });
    this.dataStorageService.edit({ key: 'UserDateFrenquency', value : new Date() });
  }

  /**
   * change after time
   * @param time 
   */
  changeAfterTime(time: number) {
    this.dataStorageService.edit({ key: 'UserAfterTime', time });
  }

  /**
   * Change history activated
   * @param history 
   */
  async changeHistory(history: boolean) {
    if (!history) {
      let confirmPopUP = await this.alertService.alertYesNO('Are you sure this action was deleted all positions saved ?', 'Desactivated history');
      confirmPopUP.onDidDismiss().then((te) => {

        if (te.role == 'yes') {
          this.dataStorageService.deleteAllDataPosition();
        }
        else if (te.role == 'no') {
          history = true;
        }
      });
    }
    this.dataStorageService.edit({ key: 'UserHistory', value: history });
  }

  /**
   * Clear list
   */
  async clearList() {
    let confirmPopUP = await this.alertService.alertYesNO('Are you sure this action was deleted all positions saved ?', 'Clear list');
    confirmPopUP.onDidDismiss().then((te) => {
      if (te.role == 'yes') {
        this.dataStorageService.deleteAllDataPosition();
      }
    });
  }

  /**
   * Clear all data app
   */
  async clearAllDataApp() {
    let confirmPopUP = await this.alertService.alertYesNO('Are you sure this action was deleted all data saved ?', 'Clear all settings');
    confirmPopUP.onDidDismiss().then((te) => {
      if (te.role == 'yes') {
        this.dataStorageService.deleteAllDataPosition();
        this.dataStorageService.clear();
        this.clear();
      }
    });
  }

  /**
   * change hours alert
   * @param hours 
   */
  changeHours(hours) {
    this.dataStorageService.edit({ key: 'UserAlertHours', value: hours});
  }

  /**
   * Change minutes alert
   * @param minutes 
   */
  changeMinutes(minutes) {
    this.dataStorageService.edit({ key: 'UserAlertMinutes', value: minutes});
  }
}
