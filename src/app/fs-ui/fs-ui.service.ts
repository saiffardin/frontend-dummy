import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsNode } from './FsNode';

@Injectable({
  providedIn: 'root',
})
export class FsUiService {
  constructor(private http: HttpClient) {}

  // cmd: cd (path)
  cdPathAPI(path: string): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;

    // console.log('fs service || param path in cd:', path);

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

  // cmd: rm (remove)
  removeAPI(node: FsNode): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;

    // console.log('node:', node);

    const { children, extension, isFolder, name, path } = node;

    // console.log('-------------------- fs service - rm');

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

  // cmd: mkdir + mktbl + mkspf
  createFilesAndFoldersAPI(obj: {
    name: string;
    cmd: string;
  }): Observable<FsNode> | any {
    const url = `http://192.168.100.37:8080/fs`;
    const { name, cmd } = obj;

    const reqBody = {
      command: cmd,
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
}
