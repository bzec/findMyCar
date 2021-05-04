import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertService } from '../service/alert-service/alert-service';
import { DataStorageService } from '../service/data-storage-service/data-storage-service';
import { ModalController } from '@ionic/angular';
import { ModalService } from '../service/modal-service/modal-service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
/**
 * List page is history of parkings
 */
export class ListPage {

  /**
   * Service to store data
   */
  private dataStorageService: DataStorageService;
  
  /**
   * Service to create modal
   */
  private modalService: ModalService;
  
  /**
   * List of positions
   */
  private positions: Array<any>;
  
  /**
   * Service to alert user
   */
  public alertService: AlertService = AlertService.getInstance();

  /**
   * is history activated
   */
  public isHistoryActivate: boolean

  constructor(private storage: Storage, private modalController: ModalController) {

    /**
     * Create service
     */
    this.dataStorageService = new DataStorageService(storage);
    this.modalService = new ModalService(modalController);
  }

  /**
   * Method of ionic cycle life
   */
  private async ionViewWillEnter() {
    const date = await this.dataStorageService.getSavedDate();
    const addToDate = parseInt(await this.dataStorageService.getFrenquencyDelete());


    // We verify if date is passed to delete all data if user have activated option
    if (date && addToDate !== 0) {
      let dateNow = new Date();
      let addToCompare = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDay());

      addToCompare.setMonth(dateNow.getMonth() + addToDate);

      if (dateNow.getTime() >= addToCompare.getTime()) {
        this.dataStorageService.deleteAllDataPosition();
      } else {
      }
    }
  }

  /**
   * Method of ionic cycle life
   */
  private ionViewDidEnter() : void {
    this.setList();
    this.dataStorageService.getIsHistory().then((result) => {
      this.isHistoryActivate = result;
    });
  }

  /**
   * Return if we have positions 
   */
  private displayScreen() : any {
    return this.positions && this.positions.length > 0 && this.isHistoryActivate;
  }

  /**
   * Set list of positions
   */
  private setList() : void {
    this.positions = this.dataStorageService.getAllData();
  }

  /**
   * Display model view
   */
  private view(item: any) {
    //ion modal
    this.modalService.presentModalParkingView(item);
  }

  /**
   * Delete item 
   * @param item 
   */
  private async delete(item: any) : Promise<void> {
    let confirmPopUP = await this.alertService.alertYesNO("Are you sure to remove this parking lot ?", 'Parking would be delete permently');

    confirmPopUP.onDidDismiss().then((te) => {

      if (te.role == 'yes') {

        this.positions.splice(this.positions.indexOf(item), 1);
        this.dataStorageService.remove(item.key);
      }
    });

  }

  /**
   * Edit name list
   * @param item 
   */
  private async edit(item: any) : Promise<void> {

    let confirmPopUP = await this.alertService.alertInputs("", item);

    confirmPopUP.onDidDismiss().then((res) => {

      if (res.role == 'ok') {
        let index = this.positions.indexOf(item);
        this.dataStorageService.edit(item);
        item.value.name = res.data.values[0];
        this.positions.fill(index, index, item);
      }
    });
  }
}