import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements OnInit {
  @Input() fileInfo_Tab!: any;
  constructor() {}

  ngOnInit(): void {}

  tabs = ['First'];
  selected = new FormControl(0);

  addTab(tabTitle?: string) {
    // ekhane jei naam dibo she name tab create hobe
    this.tabs.push(tabTitle!);

    //whenever a new tab is created, go to that tab
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
