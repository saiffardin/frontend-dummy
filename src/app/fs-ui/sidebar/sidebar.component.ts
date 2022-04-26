import { NestedTreeControl } from '@angular/cdk/tree';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Router } from '@angular/router';
import { FsUiService } from '../fs-ui.service';
import { FsNode } from '../FsNode';
import { DialogData } from './DialogData';

// main tree
let TREE_DATA: FsNode[] = [
  {
    name: 'root',
    children: [],
    path: '',
    isFolder: true,
    extension: '.dir',
  },
];

// test tree
/*
let TREE_DATA: FsNode[] = [
  {
    name: 'root',
    children: [
      {
        name: 'ACL',
        children: [
          {
            name: 't1.tbl',
            children: [],
            path: 'root/ACL/t1.tbl',
            isFolder: false,
            extension: '.tbl',
          },

          {
            name: 't2.tbl',
            children: [],
            path: 'root/ACL/t2.tbl',
            isFolder: false,
            extension: '.tbl',
          },

          {
            name: 't3.tbl',
            children: [],
            path: 'root/ACL/t3.tbl',
            isFolder: false,
            extension: '.tbl',
          },

          {
            name: 't4.tbl',
            children: [],
            path: 'root/ACL/t4.tbl',
            isFolder: false,
            extension: '.tbl',
          },
        ],
        path: 'root/ACL',
        isFolder: true,
        extension: '.dir',
      },

      {
        name: 'Accounts',
        children: [
          {
            name: 'acc1',
            children: [
              {
                name: 't7.tbl',
                children: [],
                path: 'root/Accounts/acc1/t7.tbl',
                isFolder: false,
                extension: '.tbl',
              },
            ],
            path: 'root/Accounts/acc1',
            isFolder: true,
            extension: '.dir',
          },

          {
            name: 't5.tbl',
            children: [],
            path: 'root/Accounts/t5.tbl',
            isFolder: false,
            extension: '.tbl',
          },

          {
            name: 't6.tbl',
            children: [],
            path: 'root/Accounts/t6.tbl',
            isFolder: false,
            extension: '.tbl',
          },
        ],
        path: 'root/Accounts',
        isFolder: true,
        extension: '.dir',
      },
    ],
    path: '',
    isFolder: true,
    extension: '.dir',
  },
];
*/

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() TabObjInSidebar!: any;
  @ViewChild('dialogRefHtml') dialogRefHtml!: TemplateRef<any>;

  constructor(
    private fileService: FsUiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {}

  // these objects are created for mat-tree
  treeControl = new NestedTreeControl<FsNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FsNode>();

  // rc - we create an object that contains coordinates
  menuTopLeftPosition = { x: 0, y: 0 };

  //   dialogData
  dialogData: DialogData = { type: '' };

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

  clickedContextMenuItem(event: any, obj: { node: FsNode; command: string }) {
    const { node, command } = obj;

    // rename er api er command a 'ls' dewa

    const { children, extension, isFolder, name, path } = node;

    if (name === 'root' && (command === 'rm' || command === 'ls')) {
      let action = command === 'rm' ? 'delete' : 'rename';
      let message = `Can't ${action} the root folder`;
      console.log(message);
      this._snackBar.open(message, 'STOP');

      return;
    }

    console.log('clickedContextMenuItem');

    // do cd first for - creating folder or file
    // to delete or rename the file - no cd required

    this.handleSwitchCase(command, node);
  }

  handleSwitchCase(command: string, node: FsNode) {
    switch (command) {
      case 'mkdir':
        console.log('switch mkdir cmd ===', node.name);

        let folderPath =
          node.name === 'root' ? './' : `${node.path}/${node.name}`;

        console.log('================');
        console.log('folderPath:', folderPath);
        console.log('clicked upon:', node.name);
        console.log('================');

        this.fileService.cdPathAPI(folderPath).subscribe((res: any) => {
          console.log('cd mkdir', res);
          this.openDialog({ type: 'Folder', name: node.name });
        });

        break;

      case 'mktbl':
        console.log('switch mktbl cmd');
        break;

      case 'mkspf':
        console.log('switch mkspf cmd');
        break;

      case 'mkspf':
        console.log('switch mkspf cmd');
        break;

      case 'rm':
        console.log('switch rm cmd');

        let parentPath: string = node.path!;
        console.log('parentPath:', parentPath);

        this.fileService.cdPathAPI(parentPath).subscribe((data: any) => {
          //   console.log('cdPathAPI:', data);

          console.log(`id - ${node.id}`);
          console.log(`clicked - ${node.name}`);

          //   console.log('dataSource:', this.dataSource.data);

          this.fileService.removeAPI(node).subscribe((data: any) => {
            console.log('response from remove API:', data);

            if (data.success) {
              //   refresh
              this.refreshTree();
            }

            // after delete
            // console.log('after delete dataSource:', this.dataSource.data);
            // console.log('after delete TREE_DATA:', TREE_DATA);
          });
        });

        break;

      case 'ls':
        console.log('switch ls cmd -- bcz no rename api');
        break;

      default:
        console.error('No such command exists!');
        break;
    }
  }

  clickedFiles(obj: any, node: FsNode) {
    const { addTab, selected, tabs } = this.TabObjInSidebar;

    // console.log('obj:', obj);
    // console.log('node:', node);

    console.log('TabObjInSidebar:', this.TabObjInSidebar);

    // console.log('tabs', tabs);
    // console.log('selected', selected);
    // console.log('addTab', addTab);
    console.log('----------------------------');

    addTab({ node, tabs, selected });
    // addTab({ node, tabs, selected, tabContent: result.data });

    /*
    this.fileService.changeDirAPI(node).subscribe((data: any) => {
      console.log('data:', data);
      this.fileService.cmdEnterTableApi(node).subscribe((res: any) => {
        console.log('entbl res:', res);
        if (res.success) {
            this.fileService.cmdDescribeApi().subscribe((result: any) => {
            console.log('describe : ', result);
          });
        }
      });
    });
    */
  }

  //   handleSwitchCase()

  openDialog(obj: { type: string; name: string }): void {
    const { name, type } = obj;
    console.log('type:', type);

    this.dialogData.type = type;
    this.dialogData.name = name;

    this.dialog.open(this.dialogRefHtml);
  }

  closeDialog() {
    console.log('closeDialog');
  }

  createFolderFromDialog(name: string) {
    console.log('createFolderFromDialog:', name);
    name = name.trim();
    // console.log('after trim:', name.length);

    if (name.length === 0) {
      this._snackBar.open('Every folder must have a name.', 'STOP');
      return;
    }

    console.log('length passed:', name.length);

    // call mkdir API
    this.fileService.createFolderAPI(name).subscribe((res: any) => {
      console.log('api mkdir res:', res);
    });
  }

  refreshTree() {
    //   refresh
    this.dataSource.data = [
      {
        name: 'root',
        children: [],
        path: '',
        isFolder: true,
        extension: '.dir',
      },
    ];

    TREE_DATA = [
      {
        name: 'root',
        children: [],
        path: '',
        isFolder: true,
        extension: '.dir',
      },
    ];
  }
}
