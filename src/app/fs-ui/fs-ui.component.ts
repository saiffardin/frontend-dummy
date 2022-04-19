import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fs-ui',
  templateUrl: './fs-ui.component.html',
  styleUrls: ['./fs-ui.component.css'],
})
export class FsUiComponent implements OnInit {
  fileInfo_FsUi = {};
  constructor() {}

  ngOnInit(): void {}

  captureFileInFsUi(event: any) {
    console.log('captureFileInFsUi: ', event);
    this.fileInfo_FsUi = event;
    console.log('this.fileInfo_FsUi:', this.fileInfo_FsUi);
    console.log('----------------------------');
  }
}
