import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
//import { Router, RouterEvent, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectedPath ="";

  constructor(private navCtrl: NavController) //, private router: Router, private activedRoute: ActivatedRoute)
  { //this.router.events.subscribe((event:RouterEvent)=>{
    //this.selectedPath = event.url;});
  }

  gotoBlue(){
    this.navCtrl.navigateForward("/bluetooth");
  }

}
