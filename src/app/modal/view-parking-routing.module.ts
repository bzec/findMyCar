import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalParkingView } from './view-parking-modal';

const routes: Routes = [
  {
    path: '',
    component: ModalParkingView,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModalParkingViewRoutingModule {}