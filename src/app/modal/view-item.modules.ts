import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalViewItemPage } from './view-item-modal';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ModalViewItemPageRoutingModule } from './view-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ModalViewItemPageRoutingModule
  ],
  declarations: [ModalViewItemPage]
})
export class ModalViewItemPageModule {}
