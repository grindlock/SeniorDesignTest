import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.page.html',
  styleUrls: ['./device-details.page.scss'],
})
export class DeviceDetailsPage implements OnInit {

  device: any = {};
  statusMessage: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private toastCtrl: ToastController,
    private ble: BLE) {




     }

  ngOnInit() {
    if (this.route.snapshot.data['special']){
      let passDevice = this.route.snapshot.data['special'];

      this.setStatus('Connecting to '+ passDevice.name || passDevice.id);

      this.ble.connect(passDevice.id).subscribe(
        device => this.onConnected(passDevice),
        device => this.onDeviceDisconnected(passDevice)
      );

    }
  }

  onConnected(device){
    this.ngZone.run(() => {
      this.setStatus('');
      this.device = device;
    })
  }

  onDeviceDisconnected(device){
    let toast = this.toastCtrl.create({
      message: 'The device unexpectedly disconnected.',
      duration: 3000,
      position: 'middle'
    });
  }


  setStatus(message){
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
