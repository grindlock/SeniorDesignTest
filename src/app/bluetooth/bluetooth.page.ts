import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { BleService } from '../services/ble.service';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit {

  devices: any[] = [];
  statusMessage:String;
  adv:Uint8Array;

  constructor(private router: Router,
  private toastCtrl: ToastController,
private ble:BLE,
private ngZone: NgZone,
private bleService: BleService) { }

  ngOnInit() {
    console.log('ionViewDidEnter');
    this.scan();

  }


  /*ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }*/

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 10).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 10000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
      //if (device.name == 'RVACSD' && device.advertising.kCBAdvDataManufacturerData) {
       const mfgData = new Uint8Array(device.advertising.kCBAdvDataManufacturerData);
       this.adv = new Uint8Array(device.advertising.kCBAdvDataManufacturerData);
       console.log(' Name is '+device.name+' Manufacturer Data is', mfgData);//mfgData);
//  }
    });
  }

  // If location permission is denied, you'll end up here
  async scanError(error) {
    this.setStatus('Error ' + error);
    const toast = await this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(id, device) {
    console.log(JSON.stringify(device) + ' selected');
    this.bleService.setDevice(device);
    this.router.navigateByUrl('/device-details/'+id);

  }

}
