import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_URI } from '../../../../environment';

export interface NewThread {
  ThreadUserID: string;
  ThreadTitle: string;
  ThreadImage: string;
  ThreadDate: string;
  ThreadAccess: string;
  ThreadCategory: string;
  ThreadHashtags: string;
  ThreadPost: string;
  ThreadVisibility: string;
}

export interface Post {
  PostThreadID: string;
  PostUserID: string;
  PostUserName: string;
  PostBody: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {

  private postsSubject = new BehaviorSubject<ThreadExtended[]>([]);
  public threads$ = this.threadsSubject.asObservable();

  constructor(private http: HttpClient) {}

  postThread(newThreadData: NewThread): Observable<any> {    
    return this.http.post(`${SERVER_URI}/api/posts`, newThreadData);
  }
}
