import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fs-ui',
  templateUrl: './fs-ui.component.html',
  styleUrls: ['./fs-ui.component.css'],
})
export class FsUiComponent implements OnInit {
  addTab_FsUi!: any;
  constructor() {}

  ngOnInit(): void {}

  captureAddTabInFsUi(fn: any) {
    console.log('captureAddTabInFsUi: ', fn);
    this.addTab_FsUi = fn;

    // console.log('this.addTab_FsUi :', this.addTab_FsUi);
    console.log('----------------------------');
  }
}
