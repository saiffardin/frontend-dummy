# Dev guide for FS Sidebar

## Angular Concepts:

- Angular Material :
  - [Tree](https://material.angular.io/components/tree/overview) (Nested Tree)
  - [Snackbar](https://material.angular.io/components/snack-bar/overview)
  - [Dialog](https://material.angular.io/components/dialog/overview)
- `@Input()`
- `@ViewChild()`
- `TemplateRef<T>`

## List of properties in [_sidebar.component.ts_](): <span id="list-of-properties"></span>

1. TabObjInSidebar
1. dialogRefHtml
1. confirmDeleteRefHtml
1. matMenuTrigger
1. fileService
1. \_snackBar
1. dialog
1. treeControl
1. dataSource
1. menuTopLeftPosition
1. dialogData
1. expandedNodes

## List of functions in [_sidebar.component.ts_](): <span id="list-of-functions"></span>

1. [constructor()](#fn-constructor)
2. [hasChild()](#fn-hasChild)
3. [commonErrorHandler()](#)
4. [duplicateNameHandler()]()
5. [buildChildrenArrayFromResponse()](#)
6. [showChildren()](#)
7. [nodeRecursion()](#)
8. [onRightClick()](#)
9. [clickedContextMenuItem()](#)
10. [handleSwitchCase()](#)
11. [getNodeFromPath()](#)
12. [clickedFiles()](#)
13. [openDialogToCreate()](#)
14. [closeDialog()](#)
15. [updateView()](#)
16. [createFilesAndFolders()](#)
17. [onDismissDelete()](#)
18. [onConfirmDelete()](#)

## Function Responsibilities:

1. `constructor()` : <span id="fn-constructor"></span>

   gtgtgtg

**[⬆ Back to list of functions.](#list-of-functions)**

1. `hasChild()` : <span id="fn-hasChild"></span>

   This function is used for showing the expansion icons for expandable nodes. It's used in `.html` file.

**[⬆ Back to list of functions.](#list-of-functions)**
