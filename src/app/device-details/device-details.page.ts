import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.page.html',
  styleUrls: ['./device-details.page.scss'],
})
export class DeviceDetailsPage implements OnInit {

  device: any = {};
  sensorData:Uint8Array;
  statusMessage: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private toastCtrl: ToastController,
    private ble: BLE,
  public alertController: AlertController) {




     }

  ngOnInit() {
    //if (this.route.snapshot.data['special']){
      let passDevice = this.route.snapshot.data['special'];

      this.setStatus('Connecting to '+ passDevice.name || passDevice.id);

      this.ble.connect(passDevice.id).subscribe(
        device => this.onConnected(passDevice),
        device => this.onDeviceDisconnected(passDevice)
      );

    //}
  }

  onConnected(device){
    //this.ngZone.run(() => {
    this.device = device;
      this.setStatus('Connected to '+(device.name || device.id));

      this.ble.startNotification(this.device.id, "D0AF", "6B7B").subscribe(
        data=>this.onSensorsData(data),
        error=> this.presentAlert('Unexpected Error', error)

      )
    //})
  }

onSensorsData(buffer:ArrayBuffer){
  var data = new Uint8Array(buffer);
  console.log("***  DATA NOTIFICATION  *** ", data);
  this.ngZone.run(() =>{
    this.sensorData = data;
  });
}
 onDeviceDisconnected(device){
    let toast = this.toastCtrl.create({
      message: 'The device unexpectedly disconnected.',
      duration: 3000,
      position: 'middle'
    });
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  setStatus(message){
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  ionViewWillLeave(){
    this.ble.disconnect(this.device.id).then(
      ()=>console.log('Disconnected'+JSON.stringify(this.device)),
      ()=>console.log('ERROR disconnecting '+JSON.stringify(this.device))
    )
  }

}
