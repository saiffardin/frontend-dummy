import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements AfterViewInit {
  tabs: any[] = ['First'];
  selected = new FormControl(0);

  ngAfterViewInit() {
    console.log('AfterViewInit');

    setTimeout(() => {
      this.fileEmitterFromTab.emit({
        addTab: this.addTab,
        tabs: this.tabs,
        selected: this.selected,
      });
    }, 0);
  }

  //   @Input() fileInfo_Tab!: any;
  @Output() fileEmitterFromTab = new EventEmitter();
  constructor() {}

  addTab(obj?: any) {
    const { node, tabs, selected } = obj;

    console.log('node:', node);
    console.log('tabs:', tabs);
    console.log('selected:', selected);

    const tabTitle = node.name;
    console.log('tabTitle:', tabTitle);

    // ekhane jei naam dibo she name tab create hobe
    tabs.push(tabTitle!);

    //whenever a new tab is created, go to that tab
    selected.setValue(tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
