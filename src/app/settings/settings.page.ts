import { Component } from '@angular/core';
import { DataStorageService } from '../service/data-storage-service/data-storage-service';
import { Storage } from '@ionic/storage';
import { AlertService } from '../service/alert-service/alert-service';

@Component({
  selector: 'app-setting',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})

/**
 * Setting page
 */
export class SettingsPage {


  /** Service */
  public dataStorageService: DataStorageService;

  public alertService: AlertService = AlertService.getInstance();

/**
 * user's options
 */
  public isHistory: boolean;

  public frequency: string = '0';

  public timeBeforeAlert: number = 0;

  public minutes: number;
  public hours: number;
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
  private changeFrenquency(value: string) : void {
    this.dataStorageService.edit({ key: 'UserFrenquency', value });
    this.dataStorageService.edit({ key: 'UserDateFrenquency', value: new Date() });
  }

  /**
   * change after time
   * @param time 
   */
  private changeAfterTime(time: number) : void {
    this.dataStorageService.edit({ key: 'UserAfterTime', time });
  }

  /**
   * Change history activated
   * @param history 
   */
  private async changeHistory(history: boolean) : Promise<void> {
    if (!history) {
      let confirmPopUP = await this.alertService.alertYesNO('Are you sure this action will delete all saved positions ?', 'Disabled history');
      confirmPopUP.onDidDismiss().then((te) => {

        if (te.role == 'yes') {
          this.dataStorageService.deleteAllDataPosition();
          this.dataStorageService.edit({ key: 'UserHistory', value: history });
        }
        else if (te.role == 'no') {
          history = true;
        }
      });
    } else {
      this.dataStorageService.edit({ key: 'UserHistory', value: history });
    }
  }

  /**
   * Clear list
   */
  private async clearList() : Promise<void> {
    let confirmPopUP = await this.alertService.alertYesNO('Are you sure this action will delete all positions saved ?', 'Clear list');
    confirmPopUP.onDidDismiss().then((te) => {
      if (te.role == 'yes') {
        this.dataStorageService.deleteAllDataPosition();
      }
    });
  }

  /**
   * Clear all data app
   */
  private async clearAllDataApp() : Promise<void> {
    let confirmPopUP = await this.alertService.alertYesNO('Are you sure this action will deleted all data saved ?', 'Clear all settings');
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
  private changeHours(hours) : void {
    this.dataStorageService.edit({ key: 'UserAlertHours', value: hours });
  }

  /**
   * Change minutes alert
   * @param minutes 
   */
  private schangeMinutes(minutes) : void {
    this.dataStorageService.edit({ key: 'UserAlertMinutes', value: minutes });
  }
}
