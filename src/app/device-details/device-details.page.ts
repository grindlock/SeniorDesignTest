import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { INJECTOR_BLOOM_PARENT_SIZE } from '@angular/core/src/render3/interfaces/injector';
import 'p5';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.page.html',
  styleUrls: ['./device-details.page.scss'],
})
export class DeviceDetailsPage implements OnInit {

  device: any = {};
  sensorData:Uint8Array;
  statusMessage: string;
  services:any={};

  @ViewChild('canvas') canvaEl: ElementRef;
  private _CANVAS: any;
  private _CONTEXT: any;

  private p5;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private toastCtrl: ToastController,
    private ble: BLE,
  public alertController: AlertController) {

    let passDevice = this.route.snapshot.data['special'];

    this.setStatus('Connecting to '+ passDevice.name || passDevice.id);

    this.ble.connect(passDevice.id).subscribe(
      device => this.onConnected(passDevice),
      device => this.presentAlert('Disconnected', 'The device unexpectedly disconnected.')
      
    );
    
  }
/*ionViewDidEnter(){
  this._CANVAS = this.canvaEl.nativeElement;
  this._CANVAS.width = 300;
  this._CANVAS.height = 300;
  this.initialiseCanvas();
  
}*/


  initialiseCanvas() {
    if(this._CANVAS.getContext){
      this.setupCanvas();
    }
  }
  setupCanvas() {
    this._CONTEXT = this._CANVAS.getContext('2d');
    this._CONTEXT.fillStyle = "#3e3e3e";
    this._CONTEXT.fillRect(0,0,500,500);
  }

/*constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
  };*/
/* this function comes from p5.js  and stackoverflow question 
https://stackoverflow.com/questions/44338698/p5-js-map-function-in-python
all rights are from p5.js 
  map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  }*/

  drawGraph(){
    var spectrum: any[];
    for(var i = 0; i < spectrum.length; i++){
      var amp = spectrum[i];
     // var y = this.map(amp, 0, 1, height, 0);
      this._CONTEXT.rect(this._CANVAS.width, this._CANVAS.height, 200, 200);
    }
      this._CONTEXT.lineWidth = 1;
      this._CONTEXT.strokeStyle = '#ffffff';
      this._CONTEXT.stroke();
    

  }
  ngOnInit() {
    this.createCanvas();
  }
private createCanvas(){
  this.p5 = new this.p5(this.sketch);
}
private sketch(p: any) {
  p.setup = () => {
    p.createCanvas(200,200).parent('canvas');
  };
  p.draw = () => {
    p.background(255);
    p.fill(0);
    p.rect(p.width / 2, p.height / 2, 50, 50);
  };
}
  onConnected(device){
    //this.ngZone.run(() => {
    this.device = device;
      this.setStatus('Connected to '+(device.name || device.id));
console.log('Discovered ' + JSON.stringify(this.device, null, 2));
//'D0AF', '6B7B'   '301E', 'C083'
      this.ble.startNotification(this.device.id, 'D0AF', '6B7B').subscribe(
        data=>{this.onSensorsData(data);},
        error=> {this.presentAlert('Unexpected Error', error);}

      );
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
