import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';

@Injectable()
export class NetworkService {

    isConnected : boolean;
    constructor(public network: Network, public platform: Platform) {

    }

    private _updateConnectedStatus() : void {
        if (this.platform.is('cordova')) {
            // on Device
            this.isConnected = this.network.type !== this.network.Connection.NONE
        } else {
            // on Browser
            this.isConnected = navigator.onLine
        }
    }

    public isOnline(): boolean {
        this._updateConnectedStatus();
        return this.isConnected;
    }
}