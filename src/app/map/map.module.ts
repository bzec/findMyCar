import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapPage } from './Map.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MapPageRoutingModule } from './map-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MapPageRoutingModule
  ],
  declarations: [MapPage]
})
export class MapPageModule {}