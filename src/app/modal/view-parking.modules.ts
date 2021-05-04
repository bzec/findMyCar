import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalParkingView } from './view-parking-modal';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ModalParkingViewRoutingModule } from './view-parking-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ModalParkingViewRoutingModule
  ],
  declarations: [ModalParkingView]
})
export class ModalViewItemPageModule {}
