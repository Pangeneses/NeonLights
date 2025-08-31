import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import io from 'socket.io-client';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Post {
  PostID: string;
  PostUserID: string;
  PostUserName: string;
  PostUserAvatar: string;
  PostBody: string;
  PostDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {

  private postsSubject = new BehaviorSubject<Post[]>([]);
  public posts$ = this.postsSubject.asObservable();

  private socket: ReturnType<typeof io>;

  constructor(private http: HttpClient) {

    this.socket = io('http://localhost:3000');

  }

  private normalizePost(data: any): Post {

    return {
      PostID: data.PostID ?? '',
      PostUserID: data.PostUserID ?? '',
      PostUserName: data.PostUserName ?? '',
      PostUserAvatar: data.PostUserAvatar ?? '',
      PostBody: data.PostBody ?? '',
      PostDate: data.PostDate ?? '',
    };

  }

  setPosts(postsArray: Post[]) {

    localStorage.setItem('posts', JSON.stringify(postsArray));

    this.postsSubject.next(postsArray);

  }

  clearPosts() {

    localStorage.removeItem('posts');

    this.postsSubject.next([]);

  }

  getCurrentPosts(): Post[] | null {

    return this.postsSubject.value;

  }

  getPostByID(postID: string): Post | null {

    const posts = this.getCurrentPosts();

    return posts?.find((post) => post.PostID === postID) ?? null;

  }

  fetchPosts(postIDs: string[]): Observable<boolean> {

    let params = new HttpParams();

    if (postIDs?.length) {

      postIDs.forEach((id) => params = params.append('PostIDs', id.trim()));

    }

    return this.http.get<Post[]>(`${environment.SERVER_URI}/api/posts/batch`, { params }).pipe(
      switchMap((response: any) => {

        const posts = Array.isArray(response) ? response : response.Posts;

        if (!Array.isArray(posts)) {

          throw new Error('Expected posts to be an array');

        }

        const newPosts = Array.isArray(posts) ? posts.map(this.normalizePost) : [];

        if (newPosts.length > 0) {

          this.clearPosts();

          this.setPosts(newPosts);

        }
        else {

          //end of posts

        }

        return [posts.length > 0];

      }),

    );

  }

  newReply(replyData: any): Observable<any> {

    return this.http.post(`${environment.SERVER_URI}/api/posts`, replyData);

  }

  joinPost(postID: string) {
    this.socket.emit('joinPost', postID);
  }

  leavePost(postID: string) {
    this.socket.emit('leavePost', postID);
  }

  onNewPost(callback: (postData: any) => void) {
    this.socket.on('newPost', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }


}
