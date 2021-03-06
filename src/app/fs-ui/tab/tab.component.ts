import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements AfterViewInit {
  //   tabs: any[] = ['First'];
  tabs: any[] = [{ name: 'First', content: '', path: '' }];

  selected = new FormControl(0);

  ngAfterViewInit() {
    // console.log('AfterViewInit');

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
    // console.log('obj:', obj);

    const { node, tabs, selected, tabContent } = obj;

    // console.log('node:', node);
    // console.log('tabs:', tabs);
    // console.log('selected:', selected);
    // console.log('tabContent:', tabContent);

    const tabTitle = node.name;
    // console.log('tabTitle:', tabTitle);

    const allTabsName = tabs.map((tab: any) => tab.name);

    // if tab is already open, then no need to create another tab
    if (allTabsName.includes(tabTitle)) {
      selected.setValue(allTabsName.indexOf(tabTitle));
      return;
    } else {
      // ekhane jei naam dibo she name tab create hobe
      tabs.push({ name: tabTitle, content: tabContent, path: `${node.path}` });

      //whenever a new tab is created, go to that tab
      selected.setValue(tabs.length - 1);
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  iconClicked(index: number) {
    // console.log('icon clicked');
    this.tabs.splice(index, 1);
  }
}
