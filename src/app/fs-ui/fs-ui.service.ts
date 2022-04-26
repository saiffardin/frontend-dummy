import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsNode } from './FsNode';

@Injectable({
  providedIn: 'root',
})
export class FsUiService {
  constructor(private http: HttpClient) {}

  // cmd: cd
  changeDirAPI(node: FsNode): Observable<FsNode> | any {
    let nodeName = node.name;
    let extension = node.extension;
    let path = '';

    console.log('node:', node);

    const url = `http://192.168.100.37:8080/fs`;

    if (extension === '.dir') {
      path = nodeName === 'root' ? './' : `${node.path}/${nodeName}`;
    } else {
      path = node.path!;
    }

    console.log('path in arg:', path);

    console.log('-------------------- cd');

    const reqBody = {
      command: 'cd',
      arguments: path,
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
  }

  // cmd: cd (path)
  cdPathAPI(path: string): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;

    console.log('fs service || param path in cd:', path);

    path = path === 'root' ? './' : path;

    const reqBody = {
      command: 'cd',
      arguments: path,
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
  }

  // cmd: ls
  cmdListApi(): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;

    const reqBody = {
      command: 'ls',
      arguments: '',
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
  }

  // cmd: pwd
  cmdPwdApi(): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;

    const reqBody = {
      command: 'pwd',
      arguments: '',
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
  }

  // cmd: entbl
  cmdEnterTableApi(node: FsNode): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;
    console.log('entbl node:', node.name);

    const reqBody = {
      command: 'entbl',
      arguments: `${node.name}`,
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
  }

  // cmd: describe
  cmdDescribeApi(): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;

    const reqBody = {
      command: 'describe',
      arguments: '',
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
  }

  // cmd: rm (remove)
  removeAPI(node: FsNode): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;

    console.log('node:', node);

    const { children, extension, isFolder, name, path } = node;

    console.log('-------------------- fs service - rm');

    const reqBody = {
      command: 'rm',
      arguments: name,
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
    // return new Observable((subscriber) => subscriber.complete());
  }

  // cmd: mkdir
  createFolderAPI(folderName: string): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;

    console.log('folderName:', folderName);

    console.log('-------------------- fs service - mkdir');

    const reqBody = {
      command: 'mkdir',
      arguments: folderName,
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
    // return new Observable((subscriber) => subscriber.complete());
  }
}
