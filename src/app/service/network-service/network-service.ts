import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

@Injectable()
export class NetworkService {

  private isConnected : boolean;
  constructor(public network: Network) {

  }

  private _updateConnectedStatus() : void {
    if (navigator && navigator.onLine) {
      // on Browser
      this.isConnected = navigator.onLine

    } else {
      // on Device
      this.isConnected = this.network.type !== this.network.Connection.NONE
    }
  }


  public onChangeNetworkBrowser(fun: Function) : void {
    (navigator as any).connection.addEventListener('change', fun);

  }

  public onChangeNetworkMobile(fun: Function) : void {

  }

  public isOnline() : boolean {
    this._updateConnectedStatus();
    return this.isConnected;
  }
}