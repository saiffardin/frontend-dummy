import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements AfterViewInit {
  ngAfterViewInit() {
    console.log('AfterViewInit');

    setTimeout(() => {
      this.fileEmitterFromTab.emit(this.addTab);
    }, 0);
  }

  @Input() fileInfo_Tab!: any;
  @Output() fileEmitterFromTab = new EventEmitter();
  constructor() {}

  tabs: any[] = ['First'];
  selected = new FormControl(0);

  addTab(tabTitle?: any) {
    console.log('tabTitle:', tabTitle);
    console.log('this.tabs:', this.tabs);
    console.log('this.selected:', this.selected);

    // ekhane jei naam dibo she name tab create hobe
    // this.tabs.push(tabTitle!);

    //whenever a new tab is created, go to that tab
    // this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
