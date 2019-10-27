import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
//import { Router, RouterEvent, ActivatedRoute } from '@angular/router';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import * as fftjs from 'fft-js';


//declare var p5: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  signal = [1,0,1,0,1,0,1,0];
   myFFT = fftjs.fft;
   myUtil = fftjs.util;
   phasors: any;
   frequencies: any;
   magnitudes: any;
   both: any;

  fft: any;
  public p5song:p5.SoundFile;
  public p5Sketch:p5;
  public page = 0;
  public canvas: p5.Element;
  w: any;

  selectedPath ="";

  constructor(private navCtrl: NavController) //, private router: Router, private activedRoute: ActivatedRoute)
  { //this.router.events.subscribe((event:RouterEvent)=>{
    //this.selectedPath = event.url;});
this.phasors = this.myFFT(this.signal);
this.frequencies = fftjs.util.fftFreq(this.phasors, 8000);
console.log('freq: ', this.frequencies);
this.magnitudes = fftjs.util.fftMag(this.phasors);
console.log('mag: ', this.magnitudes);


console.log('phasors: ', this.phasors);
console.log('bith: ', this.both)
  }

  ngOnInit() {
    this.createCanvas();


  }


  public createCanvas(){
    this.sketch((this.p5Sketch = new p5(this.sketch)));
  }

  public sketch(p: p5, page?: number){
    p.preload = () => {
      var song; 
      this.p5song = song = new p5.SoundFile("./assets/bensound-cute.mp3",
      playSong, error, loading);
      function playSong() {
        song.setLoop(true);
        song.play();
      }
    
      function error() {
        console.log("error while loading song");
      }
    
      function loading(load: number) {
        console.log('load: ',load);
      }
    };

    p.setup = () => {
      this.canvas = p.createCanvas(256, 256).parent('canvas');
      p.angleMode(p.DEGREES);
      p.colorMode(p.HSB);
      this.fft = new p5.FFT(0.5, 64);
      this.w = (p.width / 64) - 2;
      //this.playMusic();
      console.log('p5 fft: ', this.fft);
     };

    p.draw = () => {
      p.background(0);
      let spectrum = this.fft.analyze();
      console.log('spectrum: ', spectrum);
      p.noStroke();
      p.stroke(0,255,0);
      p.translate(256 * 0.02, 256 * 0.25);
      
      p.strokeWeight(2);
      console.log('len',spectrum.length);
      let len = spectrum.length;
      for(var i=0; i<len; i++){
        console.log('inside the loop: ', this.w);
        var temp = spectrum[i];
        //var y = p.map(temp, 0, 256, p.height, 0);
        p.fill( i,255, 255);
        let x = p.map(i, 0, spectrum.length, 0, p.width);
        let h = -p.height + p.map(spectrum[i], 0, 256, p.height, 0);
         p.rect(x, p.height, p.width / spectrum.length,  h );
        //p.rect(i*this.w, y, this.w, p.height - y);
      
      }
      p.endShape();
      //p.stroke(255);
      //p.noFill();
      

    };
  }

  viewDidEnter(){
    
  }

  gotoBlue(){
    this.navCtrl.navigateForward("/bluetooth");
  }

  playMusic(){
    if(this.p5song.isPlaying() || this.p5song.isPaused()){
      this.p5song.stop();
    }
    else{
      this.p5song.play();
    }
  }

  ngOnDestroy() {
    this.p5Sketch.remove();
    }
  



  /*private createCanvas(){
    p5 = new p5(this.sketch);
    //p5.preload(()=> {this.song = p5.loadSound('./assets/bensound-cute.mp3')}); 
    //this.song.play();

    
  }
  private sketch(p: any) {
    p.setup = () => {
      //his.song = p.loadSound('./assets/bensound-cute.mp3');
      p.createCanvas(500,500).parent('canvas');
      //this.fft = new  p5.FFT();
      //this.song.play();
      this.fft = p.p5.FFT();


    };
    p.preload = () => {
      this.song = p.loadSound('assets/bensound-cute.mp3');
    };

    p.draw = () => {
      p.background(0);
      //let spectrum = this.fft.analyze();
      p.fill(255);
      p.rect(p.width / 2, p.height / 2, 200, 200);
    };
  }*/

  

}
