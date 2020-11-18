import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalViewItemPage } from './view-item-modal';

const routes: Routes = [
  {
    path: '',
    component: ModalViewItemPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModalViewItemPageRoutingModule {}