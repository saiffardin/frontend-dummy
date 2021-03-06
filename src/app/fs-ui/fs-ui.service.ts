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
    const reqBody = {
      command: 'cd',
      arguments: path,
    };

    return this.superAPI(reqBody);
  }

  // cmd: ls
  cmdListApi(): Observable<FsNode> | any {
    const reqBody = {
      command: 'ls',
      arguments: '',
    };

    return this.superAPI(reqBody);
  }

  // cmd: rm (remove)
  removeAPI(node: FsNode): Observable<FsNode> | any {
    const { children, extension, isFolder, name, path } = node;

    const reqBody = {
      command: 'rm',
      arguments: name,
    };

    return this.superAPI(reqBody);
  }

  // cmd: mkdir + mktbl + mkspf
  createFilesAndFoldersAPI(obj: {
    name: string;
    cmd: string;
  }): Observable<FsNode> | any {
    const { name, cmd } = obj;

    const reqBody = {
      command: cmd,
      arguments: name,
    };

    return this.superAPI(reqBody);
  }

  /** superAPI() contains the codes which is common across all the apis */
  private superAPI(reqBody: any) {
    const url = `http://192.168.103.65:8080/fs`;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let httpOptions = {
      headers: headers,
    };

    return this.http.post<any>(url, reqBody, httpOptions);
  }
}
