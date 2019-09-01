import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { BleService } from './../services/ble.service';

@Injectable({
  providedIn: 'root'
})
export class BleResolverService implements Resolve<any> {

  constructor(private bleService: BleService) { }

  resolve(){
    //let id = route.paramMap.get('id');
    return this.bleService.getDevice();
  }
}
