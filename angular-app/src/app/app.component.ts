import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  phaser = null;

  ngOnInit() {
    console.log('phaser', Phaser);
    this.phaser = Phaser;
  }
}
