import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsNode } from './fs-ui.component';

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

    console.log('path:', path);

    console.log('--------------------');

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

  showChildrenAPI(node: FsNode): Observable<FsNode> | any {
    let nodeName = node.name;
    return this.changeDirAPI(node);
  }
}
