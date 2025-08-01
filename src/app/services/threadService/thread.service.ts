import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

import { SERVER_URI } from '../../../../environment';

export interface Thread {
  ThreadID: string;
  ThreadUserID: string;
  ThreadTitle: string;
  ThreadBody: string;
  ThreadImage: string;
  ThreadDate: string;
  ThreadCategory: EnumForumCategory;
  ThreadHashtags: string[];
}

export interface ThreadExtended extends Thread {
  ThreadUserName: string;
}

export interface ThreadsResponse {
  Threads: Thread[];
}

@Injectable({
  providedIn: 'root',
})
export class ThreadService {

  private threadsSubject = new BehaviorSubject<ThreadExtended[]>([]);
  public threads$ = this.threadsSubject.asObservable();

  constructor(private http: HttpClient) {

    const savedThreads = localStorage.getItem('threads');

    if (savedThreads) {

      try {

        const data = JSON.parse(savedThreads);

        const threadsArray: ThreadExtended[] = Array.isArray(data)
          ? data.map((item: any) => this.normalizeThread(item))
          : [];

        this.threadsSubject.next(threadsArray);

      } catch (err) {

        console.error('Failed to parse saved threads:', err);

        this.threadsSubject.next([]);

      }

    }

  }

  private normalizeThread(data: any): ThreadExtended {

    return {
      ThreadID: data.ThreadID ?? '',
      ThreadUserID: data.ThreadUserID ?? '',
      ThreadUserName: data.ThreadUserName ?? '',
      ThreadTitle: data.ThreadTitle ?? '',
      ThreadBody: data.ThreadBody ?? '',
      ThreadImage: data.ThreadImage ?? '',
      ThreadDate: data.ThreadDate ?? new Date().toISOString(),
      ThreadCategory: data.ThreadCategory ?? EnumForumCategory.Unspecified,
      ThreadHashtags: Array.isArray(data.ThreadHashtags) ? data.ThreadHashtags : [],
    };

  }

  setThreads(threadsArray: ThreadExtended[]) {

    localStorage.setItem('articles', JSON.stringify(threadsArray));

    this.threadsSubject.next(threadsArray);

  }

  clearThreads() {

    localStorage.removeItem('threads');

    this.threadsSubject.next([]);

  }

  getCurrentThreads(): ThreadExtended[] | null {

    return this.threadsSubject.value;

  }

  getThreadByID(threadID: string): ThreadExtended | null {

    const articles = this.getCurrentThreads();

    return articles?.find((article) => article.ThreadID === threadID) ?? null;

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

    return this.http.get<ThreadExtended[]>(`${SERVER_URI}/api/threads/chunk`, { params }).pipe(
      switchMap((response: any) => {

        const threads = Array.isArray(response) ? response : response.Threads;

        if (!Array.isArray(threads)) {

          throw new Error('Expected threads to be an array');

        }

        const newArticles = Array.isArray(threads) ? threads.map(this.normalizeThread) : [];

        console.log(newArticles);

        if (newArticles.length > 0) {

          this.clearThreads();

          this.setThreads(newArticles);

        }
        else {

          //end of threads

        }

        return [threads.length > 0];

      }),

    );

  }

  postThread(threadData: Thread): Observable<any> {

    return this.http.post(`${SERVER_URI}/api/threads`, threadData);

  }

}

export enum EnumForumCategory {
  Unspecified = 'Unspecified',
  RedDragonSociety = 'Red Dragon Society',
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
