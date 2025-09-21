import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Thread {
  ThreadID: string;
  ThreadUserID: string;
  ThreadUserName: string;
  ThreadUserAvatar: string;
  ThreadTitle: string;
  ThreadBody: string;
  ThreadPosts: string[];
  ThreadDate: string;
  ThreadAccess: string;
  ThreadCategory: EnumForumCategory;
  ThreadHashtags: string[];
}

export interface ThreadsResponse {
  Threads: Thread[];
}

@Injectable({
  providedIn: 'root',
})
export class ThreadService {

  private threadsSubject = new BehaviorSubject<Thread[]>([]);
  public threads$ = this.threadsSubject.asObservable();

  constructor(private http: HttpClient) {

    const savedThreads = localStorage.getItem('threads');

    if (savedThreads) {

      try {

        const data = JSON.parse(savedThreads);

        const threadsArray: Thread[] = Array.isArray(data)
          ? data.map((item: any) => this.normalizeThread(item))
          : [];

        this.threadsSubject.next(threadsArray);

      } catch (err) {

        console.error('Failed to parse saved threads:', err);

        this.threadsSubject.next([]);

      }

    }

  }

  private normalizeThread(data: any): Thread {

    return {
      ThreadID: data.ThreadID ?? '',
      ThreadUserID: data.ThreadUserID ?? '',
      ThreadUserName: data.ThreadUserName ?? '',
      ThreadUserAvatar: data.ThreadUserAvatar ?? '',
      ThreadTitle: data.ThreadTitle ?? '',
      ThreadBody: data.ThreadBody ?? '',
      ThreadPosts: data.ThreadPosts ?? '',
      ThreadDate: data.ThreadDate ?? new Date().toISOString(),
      ThreadAccess: data.ThreadAccess ?? 0,
      ThreadCategory: data.ThreadCategory ?? EnumForumCategory.Unspecified,
      ThreadHashtags: Array.isArray(data.ThreadHashtags) ? data.ThreadHashtags : [],
    };

  }

  setThreads(threadsArray: Thread[]) {

    localStorage.setItem('threads', JSON.stringify(threadsArray));

    this.threadsSubject.next(threadsArray);

  }

  clearThreads() {

    localStorage.removeItem('threads');

    this.threadsSubject.next([]);

  }

  getCurrentThreads(): Thread[] | null {

    return this.threadsSubject.value;

  }

  getThreadByID(threadID: string): Observable<any> {

    return this.http.get(`${environment.SERVER_URI}/threads/${threadID}`);

  }

  fetchThreadChunk(options: {
    limit: number;
    lastID?: string;
    direction?: 'up' | 'down';
    ThreadUserID?: string;
    ThreadCategory?: EnumForumCategory;
    ThreadHashtags?: string[];
    ThreadFrom?: string;
    ThreadTo?: string;
  }): Observable<boolean> {

    let params = new HttpParams().set('limit', options.limit.toString());

    if (options.lastID) params = params.set('lastID', options.lastID);

    if (options.direction) params = params.set('direction', options.direction);

    if (options.ThreadUserID) params = params.set('ThreadUserID', options.ThreadUserID);

    if (options.ThreadCategory && options.ThreadCategory !== EnumForumCategory.Unspecified) {

      params = params.set('ThreadCategory', options.ThreadCategory.replace(/\s|_/g, ''));

    }

    if (options.ThreadHashtags?.length) {

      options.ThreadHashtags.forEach((tag) => tag.trim() && (params = params.append('ThreadHashtags', tag.trim())));

    }

    if (options.ThreadFrom && !isNaN(Date.parse(options.ThreadFrom))) {

      params = params.set('ThreadFrom', new Date(options.ThreadFrom).toISOString());

    }

    if (options.ThreadTo && !isNaN(Date.parse(options.ThreadTo))) {

      params = params.set('ThreadTo', new Date(options.ThreadTo).toISOString());

    }

    return this.http.get<Thread[]>(`${environment.SERVER_URI}/threads/chunk`, { params }).pipe(
      switchMap((response: any) => {

        const threads = Array.isArray(response) ? response : response.Threads;

        if (!Array.isArray(threads)) {

          throw new Error('Expected threads to be an array');

        }

        const newThreads = Array.isArray(threads) ? threads.map(this.normalizeThread) : [];

        if (newThreads.length > 0) {

          this.clearThreads();

          this.setThreads(newThreads);

        }
        else {

          //end of threads

        }

        return [threads.length > 0];

      }),

    );

  }

  newThread(threadData: Thread): Observable<any> {

    return this.http.post(`${environment.SERVER_URI}/threads`, threadData);

  }

}

export enum EnumForumCategory {
  Unspecified = 'Unspecified',
  YourSite = 'Your Site',
  PoliticalSci = 'Political Science',
  SocialSci = 'Social Science',
  Economics = 'Economics',
  DataSci = 'Data Science',
  Philosophy = 'Philosophy',
  Theology = 'Theology',
  Law = 'Law',
  History = 'History',
  Anthropology = 'Anthropology',
  Archeology = 'Archeology',
  Languages = 'Languages',
  Pedagogy = 'Pedagogy',
  Medicine = 'Medicine',
  Biology = 'Biology',
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Math = 'Math',
  Climatology = 'Climatology',
  Astronomy = 'Astronomy',
  MechanicalEng = 'Mechanical Engineering',
  ElectricalEng = 'Electrical Engineering',
  SoftwareEng = 'Software Engineering',
  Trades = 'Trades',
  Business = 'Business',
  Theater = 'Theater',
  FineArt = 'Fine Art',
  ArtHistory = 'Art History',
  Writting = 'Writting',
  Crafting = 'Crafting',
  Cooking = 'Cooking',
  Film = 'Film',
  TV = 'TV',
  Gaming = 'Gaming',
  Sports = 'Sports',
}
