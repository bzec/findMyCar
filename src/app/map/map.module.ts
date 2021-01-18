import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapPage } from './Map.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MapPageRoutingModule } from './map-routing.module';
import { NetworkService } from '../service/network-service/network-service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MapPageRoutingModule
  ],
  declarations: [MapPage],
  providers: [NetworkService]
})

export class MapPageModule {}
