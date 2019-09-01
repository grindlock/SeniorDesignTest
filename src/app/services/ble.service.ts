import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  private device;

  constructor() { }

  setDevice(device){
    this.device = device;
  }

  getDevice(){
    return this.device;
  }
}
