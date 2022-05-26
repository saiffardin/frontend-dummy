# Dev guide for FS Sidebar
## Angular Concepts:
- Angular Material : 
    - [Tree](https://material.angular.io/components/tree/overview) (Nested Tree)
    - [Snackbar](https://material.angular.io/components/snack-bar/overview)
    - [Dialog](https://material.angular.io/components/dialog/overview)
- `@Input()`
- `@ViewChild()`
- `TemplateRef<T>`

## List of properties in [*sidebar.component.ts*](): <span id="list-of-properties"></span>
1. TabObjInSidebar
1. dialogRefHtml
1. confirmDeleteRefHtml
1. matMenuTrigger
2. fileService
2. _snackBar
2. dialog
3. treeControl
3. dataSource
4. menuTopLeftPosition
4. dialogData
4. expandedNodes


## List of functions in [*sidebar.component.ts*](): <span id="list-of-functions"></span>
1. [constructor()](#fn-constructor)
2. [hasChild()](#)
2. [commonErrorHandler()](#)
2. [duplicateNameHandler()]()
2. [buildChildrenArrayFromResponse()](#)
2. [showChildren()](#)
2. [nodeRecursion()](#)
2. [onRightClick()](#)
2. [clickedContextMenuItem()](#)
2. [handleSwitchCase()](#)
2. [getNodeFromPath()](#)
2. [clickedFiles()](#)
2. [openDialogToCreate()](#)
2. [closeDialog()](#)
2. [updateView()](#)
2. [createFilesAndFolders()](#)
2. [onDismissDelete()](#)
2. [onConfirmDelete()](#)


## Function Responsibilities:

1. `constructor()` : <span id="fn-constructor"></span>

    gtgtgtg

**[⬆ Back to list of functions.](#list-of-functions)**