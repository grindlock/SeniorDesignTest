import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BleResolverService }from './resolver/ble-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
        path: 'bluetooth',
        loadChildren: './bluetooth/bluetooth.module#BluetoothPageModule'
  },
  { path: 'device-details', loadChildren: './device-details/device-details.module#DeviceDetailsPageModule'},
  {
    path: 'device-details/:id',
    resolve:{
      special: BleResolverService
    },
    loadChildren: './device-details/device-details.module#DeviceDetailsPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
