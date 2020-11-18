import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingPage } from './setting.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { SettingPageRoutingModule } from './setting-routing.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: SettingPage }]),
    SettingPageRoutingModule,
  ],
  declarations: [SettingPage]
})
export class SettingPageModule {}
