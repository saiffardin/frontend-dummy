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
    isFolderOpen: false,
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() TabObjInSidebar!: any;
  @ViewChild('dialogRefHtml') dialogRefHtml!: TemplateRef<any>;
  @ViewChild('confirmDeleteRefHtml') confirmDeleteRefHtml!: TemplateRef<any>;
  // rc - reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;

  constructor(
    private fileService: FsUiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
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

  // already expanded nodes
  expandedNodes: any[] = [];

  //  mat-tree
  hasChild = (_: number, node: FsNode) =>
    (!!node.children && node.children.length > 0) || node.isFolder;

  // to handle api subscribe error
  private commonErrorHandler = (err: any) => {
    console.log('Error in File System Subscribe:', err.error);
    console.error(err.error.message);
  };

  /** this function is evoked
   * when user tries to create a folder/file
   * that already exists in that same directory
   */
  duplicateNameHandler = (err: any) => {
    const errorMsg: string = err.error.message.split(':');
    if (errorMsg[0] === '[FOLDER CREATE FAILED]') {
      console.log(errorMsg);
      this._snackBar.open(`${errorMsg[2]}`, `${errorMsg[0]}`);
      return;
    }

    console.log('Error in "createFilesAndFoldersAPI" Subscribe:', err.error);
    console.error(err.error.message);
  };

  //  helper function -- called from 'showChildren' method
  buildChildrenArrayFromResponse(obj: { node: FsNode; data: any[] }) {
    // console.log('buildChildrenArrayFromResponse -- obj:', obj);

    const { node, data } = obj;

    let childrenArray = data.map((child: any) => {
      // these are missing in 'child'
      // path;
      // children;
      // isFolder?: boolean;

      let path: string = `${node.path}/${node.name}`;

      let children: FsNode[] = [];
      let isFolder: boolean = child.extension === '.dir' ? true : false;
      let isFolderOpen = false;

      //   console.log('%cbefore path:', 'color:blue', path);

      if (path[0] === '/') {
        path = path.substring(1);
      }

      return {
        ...child,
        path,
        children,
        isFolder,
        isFolderOpen,
      };
    });

    return childrenArray;
  }

  /**
   * 'showChildren' method is called when
   * the user clicks the 'left-side-icon' of any folder on the sidebar
   * @param node is the tree-node thats been clicked
   */
  showChildren(node: FsNode, fromHTML: boolean = true) {
    /**
     * no api call for closing the tree
     */

    /**
     * it will preserve the state of the tree,
     * when it's reopened
     * after closing the tree once
     */

    if (
      this.treeControl.isExpanded(node) &&
      !this.expandedNodes.includes(node.name)
    ) {
      //   console.log('open');
      this.expandedNodes.push(node.name);
    } else if (
      !this.treeControl.isExpanded(node) &&
      this.expandedNodes.includes(node.name)
    ) {
      console.log('close');
      node.isFolderOpen = false;
      node.children = [];
      this.expandedNodes = this.expandedNodes.filter(
        (expNode) => expNode !== node.name
      );
    }

    if (
      fromHTML &&
      (!this.treeControl.isExpanded(node) ||
        (!!node.children && node.children.length > 0))
    ) {
      console.log('returned from showChildren');
      return;
    }

    /*
    if (fromHTML && !this.treeControl.isExpanded(node)) {
      console.log('returned from showChildren');
      return;
    }
    */

    let { name, path, children, isFolder, extension } = node;

    path = name === 'root' ? './' : `${path}/${name}`;

    // console.log('%cafter path:', 'color:red', path);

    this.fileService.cdPathAPI(path).subscribe((data: any) => {
      console.log('cd:', data);

      this.fileService.cmdListApi().subscribe((res: any) => {
        // console.log('ls:', res);
        // console.log('%c--------------------', 'color:blue;font-weight: bold');

        node.children = this.buildChildrenArrayFromResponse({
          node,
          data: res.data,
        });

        node.isFolderOpen = true;

        // the following 3 lines were done to render tree upon data change
        const data = this.dataSource.data;
        this.dataSource.data = null!;
        this.dataSource.data = data;

        // if (!fromHTML){
        //     this.nodeRecursion(this.dataSource.data[0]);
        // }

        // console.log('this.dataSource:', this.dataSource.data);
      }, this.commonErrorHandler);
    }, this.commonErrorHandler);
  }

  viewExpandedNodes() {
    console.log('this.expandedNodes', this.expandedNodes);
    this.treeControl.collapseAll();

    // this.nodeRecursion(this.dataSource.data[0]);

    setTimeout(() => this.nodeRecursion(this.dataSource.data[0]), 3000);
  }

  nodeRecursion(node: FsNode): any {
    if (node.isFolderOpen) {
      this.treeControl.expand(node);
    }
    console.log(
      `%c ${node.name} - `,
      'color:blue',
      `children : ${node.children?.length} -- \n`,
      `folder open - ${node.isFolderOpen}`,
      '\n==========================================='
    );
    console.log();
    if (node.children?.length === 0) {
      console.log(`%c '${node.name}' has no dir open`, 'color:red');
      console.log('----------------------------------------');
      //   return node;
    } else {
      node.children?.forEach((child) => {
        if (child.isFolder) {
          console.log(`'${child.name}' is a child of '${node.name}'`);
          this.nodeRecursion(child);
        }
        // return this.nodeRecursion(child);
      });
    }
  }

  visitChildren(node: FsNode) {
    let nodeChildren = node.children;
    let childrenLength = nodeChildren?.length;

    node.children?.forEach((child) => {
      console.log('%c child - ', 'color:blue', child);
    });
  }

  /**
   * 'onRightClick' method called when
   * the mouse is on a folder or a file, and
   * user clicks the right button of mouse.
   * This function opens a context menu.
   * @param event MouseEvent, it contains the coordinates
   * @param item Our data (object) contains info about the click
   */
  onRightClick(event: MouseEvent, item: { folder: boolean; node: FsNode }) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;

    // we open the menu
    // we pass to the menu the information about our object
    this.matMenuTrigger.menuData = { item: item };

    // change to that directory
    const { folder, node } = item;
    console.log('node path:', node.path);
    console.log('folder', folder);

    if (folder) {
      /**
       * node.path 'false' means the folder is root
       * node.path 'true' means the folder is not root
       */
      let changeDirTo!: string;
      if (node.path) changeDirTo = `${node.path}/${node.name}`;
      else changeDirTo = `./`;

      this.fileService.cdPathAPI(changeDirTo).subscribe((data: any) => {
        console.log(data);
      });
    }

    // we open the menu
    this.matMenuTrigger.openMenu();
  }

  /**
   * 'clickedContextMenuItem' method is called when
   * the user clicks any of the items of context menu
   * @param obj.node contains the data of upon which 'node' the right click was done,
   * @param obj.command tells us upon which context menu item was clicked. Based on this click command will execute.
   * such few commands are : 'mkdir', 'mkspf', 'mktbl', 'ls', 'pwd'
   */
  clickedContextMenuItem(obj: { node: FsNode; command: string }) {
    const { node, command } = obj;

    // rename er api er command a 'ls' dewa

    const { children, extension, isFolder, name, path } = node;

    if (name === 'root' && (command === 'rm' || command === 'ls')) {
      let action = command === 'rm' ? 'delete' : 'rename';
      let message = `Can't ${action} the root folder`;
      //   console.log(message);
      this._snackBar.open(message, 'STOP');

      return;
    }

    // do cd first for - creating folder or file
    // to delete or rename the file - no cd required

    this.handleSwitchCase(command, node);
  }

  // helper function for 'clickedContextMenuItem()'
  handleSwitchCase(command: string, node: FsNode) {
    switch (command) {
      case 'mkdir':
        this.openDialogToCreate({ type: 'Folder', node, command });
        break;

      case 'mktbl':
        this.openDialogToCreate({ type: 'Table File', node, command });
        break;

      case 'mkspf':
        this.openDialogToCreate({ type: 'SOP File', node, command });
        break;

      case 'rm':
        let parentPath: string = node.path === 'root' ? './' : node.path!;
        // console.log('node:', node);

        this.fileService.cdPathAPI(parentPath).subscribe((data: any) => {
          //   console.log('cdPathAPI:', data);
          this.dialog.open(this.confirmDeleteRefHtml, { data: node });
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

  getNodeFromPath(path: string) {
    let pathArr: any[] = path.split('/');
    let node: FsNode = this.dataSource.data[0];
    let nodeChildren: FsNode[];

    console.log('pathArr:', pathArr);
    // console.log('node:', node);

    // if the folder is 'root'
    if (pathArr[0] === '') {
      // this.treeControl.collapse(node);
      // node.children = [];
      console.log('saif root - ', node);
      this.showChildren(node, false);

      return node;
    }

    pathArr.forEach(async (path) => {
      if (path !== 'root') {
        // console.log('path:', path);
        nodeChildren = node.children!;
        node = nodeChildren.find((n) => n.name === path)!;

        // this.showChildren(node, false);

        // console.log('first - ', node);
      }
    });

    // this.treeControl.collapse(node);
    // node.children = [];
    // this.showChildren(node, false);
    return node;
  }

  collapseParentFolder(path: any) {
    let node = this.getNodeFromPath(path);
    this.showChildren(node, false);

    // this.nodeRecursion(this.dataSource.data[0]);
    // setTimeout(() => this.nodeRecursion(this.dataSource.data[0]), 3000);
  }

  /**
   * 'clickedFiles' method is called to
   * open a sidebar 'file' to the right-side panel.
   * @param node contains the data of
   * upon which 'node' (in this case its a 'file') the click was done
   */
  clickedFiles(node: FsNode) {
    const { addTab, selected, tabs } = this.TabObjInSidebar;

    // console.log('obj:', obj);
    // console.log('node:', node);

    // console.log('TabObjInSidebar:', this.TabObjInSidebar);

    // console.log('tabs', tabs);
    // console.log('selected', selected);
    // console.log('addTab', addTab);
    // console.log('----------------------------');

    addTab({ node, tabs, selected });
    // addTab({ node, tabs, selected, tabContent: result.data });

    // run cd
    // then enter table => using API
  }

  /**
   * this method is called from 'handleSwitchCase()'
   * 'openDialogToCreate' method is called to open a dialog box only
   * it is done when the user wants to create a file or folder in the context menu
   * @param obj.type denotes what kind of file or folder it is
   * @param obj.node denotes the node in the tree
   * @param obj.command denotes the command
   * commands can be: 'mkdir', 'mkspf' , 'mktbl'
   */
  openDialogToCreate(obj: {
    type: string;
    node: FsNode;
    command: string;
  }): void {
    const { type, node, command } = obj;

    let path = node.name === 'root' ? './' : `${node.path}/${node.name}`;

    this.fileService.cdPathAPI(path).subscribe((res: any) => {
      this.dialogData.type = type;
      this.dialogData.name = node.name;
      this.dialog.open(this.dialogRefHtml, { data: node });
    });
  }

  closeDialog() {
    console.log('closeDialog');
  }

  /** to create folders, sop file and table files */
  createFilesAndFolders(obj: { name: string; type: string; node: FsNode }) {
    let { name, type, node } = obj;
    let cmd!: string;

    // console.log(`${type} -- ${name}`);
    name = name.trim();
    if (name.length === 0) {
      this._snackBar.open(
        `Every ${type.toLowerCase()} must have a name.`,
        'STOP'
      );
      return;
    }

    if (type === 'Folder') cmd = 'mkdir';
    else if (type === 'SOP File') cmd = 'mkspf';
    else if (type === 'Table File') cmd = 'mktbl';

    this.fileService
      .createFilesAndFoldersAPI({ name, cmd })
      .subscribe((res: any) => {
        if (res.success) {
          this.collapseParentFolder(`${node.path}/${node.name}`);
        } else {
          throw new Error(res);
        }
      }, this.duplicateNameHandler);
  }

  onDismissDelete() {
    // console.log('onDismissDelete');
    this._snackBar.open('Delete operation is cancelled', 'OK');
  }

  /** this method is called when user is "sure" that he will delete record */
  onConfirmDelete(node: any) {
    this.fileService.removeAPI(node).subscribe((data: any) => {
      //   console.log('response from remove API:', data);

      if (data.success) {
        //   refresh
        this.collapseParentFolder(node.path);
        // this.refreshTree();
      }
    }, this.commonErrorHandler);
  }
}
