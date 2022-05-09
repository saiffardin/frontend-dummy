import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fs-ui',
  templateUrl: './fs-ui.component.html',
  styleUrls: ['./fs-ui.component.css'],
})
export class FsUiComponent implements OnInit {
  TabObjInFsUi!: any;
  constructor() {}

  ngOnInit(): void {}

  captureObjInFsUi(obj: any) {
    console.log('captureAddTabInFsUi: ', obj);
    this.TabObjInFsUi = obj;

    // console.log('this.TabObjInFsUi :', this.TabObjInFsUi);
    console.log('----------------------------');
  }
}
