import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FsUiService } from './fs-ui.service';

/**
 * Each node has a name and an optional list of children.
 */
export interface FsNode {
  id?: number;
  name: string;
  path?: string;
  children?: FsNode[];
  isFolder?: boolean;
  extension?: string;
}

const TREE_DATA: FsNode[] = [
  {
    name: 'root',
    children: [],
    path: '',
    isFolder: true,
    extension: '.dir',
  },
];

@Component({
  selector: 'app-fs-ui',
  templateUrl: './fs-ui.component.html',
  styleUrls: ['./fs-ui.component.css'],
})
export class FsUiComponent implements OnInit {
  constructor(private fileService: FsUiService) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {}

  // these objects are created for mat-tree
  treeControl = new NestedTreeControl<FsNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FsNode>();

  // rc - we create an object that contains coordinates
  menuTopLeftPosition = { x: 0, y: 0 };

  // rc - reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;

  //  mat-tree
  hasChild = (_: number, node: FsNode) =>
    (!!node.children && node.children.length > 0) || node.isFolder;

  // handle api subscribe error
  private commonErrorHandler = (err: any) => {
    console.log('Error in File System Subscribe:', err.error);
    console.error(err.error.message);
  };

  /**
   * 'showChildren' method is called when
   * the user clicks the 'left-side-icon' of any folder on the sidebar
   * @param node is the tree-node thats been clicked
   */
  showChildren(e: any, node: FsNode) {
    // console.log('treeControl:', this.treeControl.isExpanded(node));
    // console.log('node size:', node?.children?.length);

    /**
     * no api call for closing the tree
     */

    /**
     * it will preserve the state of the tree,
     * when it's reopened
     * after closing the tree once
     */
    if (
      !this.treeControl.isExpanded(node) ||
      (!!node.children && node.children.length > 0)
    ) {
      return;
    }

    // let { name,path } = node;

    this.fileService.changeDirAPI(node).subscribe((data: any) => {
      console.log('data:', data);

      this.fileService.cmdListApi().subscribe((res: any) => {
        console.log('res:', res);
        // console.log(res.data);

        node.children = res.data.map((child: any) => {
          /*
            path;
            children;
            isFolder?: boolean;
            */

          let path: string = `${node.path}/${node.name}`;
          let children: FsNode[] = [];
          let isFolder: boolean = child.extension === '.dir' ? true : false;

          if (path[0] === '/') {
            path = path.substring(1);
          }

          //   console.log('------------------');
          //   console.log('child:', child);
          //   console.log('path:', path);
          //   console.log('children:', children);
          //   console.log('isFolder:', isFolder);

          return {
            ...child,
            path,
            children,
            isFolder,
          };
        });

        // console.log('===============');

        // console.log('node:', node);

        // the following 3 lines were done to render tree upon data change
        const data = this.dataSource.data;
        this.dataSource.data = null!;
        this.dataSource.data = data;

        // console.log('this.dataSource:', this.dataSource.data);
      }, this.commonErrorHandler);
    }, this.commonErrorHandler);
  }

  /**
   * 'onRightClick' method called when
   * the user click with the right button
   * @param event MouseEvent, it contains the coordinates
   * @param item Our data contained in the row of the table
   */
  onRightClick(event: MouseEvent, item?: any) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;

    // we open the menu
    // we pass to the menu the information about our object
    this.matMenuTrigger.menuData = { item: item };

    // we open the menu
    this.matMenuTrigger.openMenu();
  }
}
