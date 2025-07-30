import { Routes } from '@angular/router';
import { BusViewComponent } from './components/bus-view/bus-view.component';

export const routes: Routes = [
  { 
    path: 'section/:id', 
    component: BusViewComponent 
  },
  { 
    path: '', 
    redirectTo: 'section/gas-turbine', 
    pathMatch: 'full' 
  }
];