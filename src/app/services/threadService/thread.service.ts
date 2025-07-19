import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

import { ListedUserService, ListedUser } from '../usersService/users.service';

import { SERVER_URI } from '../../../../environment';

export interface Thread {
  ThreadID:       string;
  AuthorID: string | { _id: string, UserName: string }               
  ThreadTitle:    string;         
  ThreadBody:     string;
  ThreadImage:    string;
  ThreadDate:     string;     
  ThreadCategory: EnumForumCategory;          
  ThreadHashtags: string[];            
}

export interface ThreadWithUserName extends Thread {
  AuthorName?: string;
}

export interface ThreadsResponse {
  Threads: Thread[];
}

@Injectable({
  providedIn: 'root',
})
export class ThreadService {

  private threadsSubject = new BehaviorSubject<FormArray | null>(null);

  public threads$: Observable<FormArray | null> = this.threadsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: ListedUserService,
    private fb: FormBuilder) {

    const savedThreads = localStorage.getItem('threads');

    if (savedThreads) {

      const data = JSON.parse(savedThreads);

      const threadsFormArray = this.toFormArray(data);

      this.threadsSubject.next(threadsFormArray);

    }

  }

  getListedUsers(): ListedUser[] {
    
    return this.userService.getUsers();

  }

  createThreadForm(): FormGroup {

    return this.fb.group({
      ThreadID:        [''],
      AuthorID:        [''],
      ThreadTitle:     ['', { validators: [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9.\\- ]+$')], updateOn: 'blur' }],
      ThreadBody:      ['', { validators: [Validators.required, Validators.minLength(500)], updateOn: 'blur' }],
      ThreadImage:     [''],
      ThreadDate:      ['', { validators: [Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)], updateOn: 'blur' }],
      ThreadCategory:  [EnumForumCategory.Unspecified],
      ThreadHashtags:  [[]]
    });

  }

  toForm(thread: any): FormGroup {

    return this.fb.group({
      ThreadID:        [thread.ThreadID],
      AuthorID:        [thread.AuthorID],
      ThreadTitle:     [thread.ThreadTitle],
      ThreadBody:      [thread.ThreadBody],
      ThreadImage:     [thread.ThreadImage],
      ThreadDate:      [thread.ThreadDate],
      ThreadCategory:  [thread.ThreadCategory],
      ThreadHashtags:  [thread.ThreadHashtags || []]
    });

  }

  toFormArray(threads: any[]): FormArray {

    const formGroups = threads.map(thread => this.toForm(thread));

    return this.fb.array(formGroups);

  }

  setThreads(formArray: FormArray) {

    localStorage.setItem('threads', JSON.stringify(formArray.getRawValue()));

    this.threadsSubject.next(formArray);

  }

  clearThreads() {

    localStorage.removeItem('threads');

    this.threadsSubject.next(this.fb.array([]));

  }

  getCurrentThreads(): FormArray | null {

    return this.threadsSubject.value;

  }

  postThread(threadData: Thread): Observable<any> {
    
    return this.http.post(`${SERVER_URI}/api/threads`, threadData);

  }

  fetchThreadChunk(options: {
    limit: number;
    lastId?: string;
    direction?: 'up' | 'down';
    AuthorID?: string | string[];
    ThreadCategory?: EnumForumCategory;
    ThreadHashtags?: string[];
    fromDate?: string;
    toDate?: string;
  }): Observable<boolean> {

    let params = new HttpParams().set('limit', options.limit.toString());

    if (options.lastId) {

      params = params.set('lastId', options.lastId);

    }

    if (options.direction) {

      params = params.set('direction', options.direction);

    }

    if (Array.isArray(options.AuthorID)) {

      for (const id of options.AuthorID) {

        if (id.trim()) {

          params = params.append('AuthorID', id.trim());

        }

      }

    } else if (typeof options.AuthorID === 'string' && options.AuthorID.trim()) {

      params = params.set('AuthorID', options.AuthorID.trim());

    }

    if (options.ThreadCategory && options.ThreadCategory !== EnumForumCategory.Unspecified) {

      params = params.set('ThreadCategory', options.ThreadCategory.replace(/[\s_]/g, ''));

    }

    if (options.ThreadHashtags?.length) {

      for (const tag of options.ThreadHashtags) {

        if (tag.trim()) {

          params = params.append('ThreadHashtags', tag.trim());

        }

      }

    }

    if (options.fromDate && !isNaN(Date.parse(options.fromDate))) {

      params = params.set('from', new Date(options.fromDate).toISOString());

    }

    if (options.toDate && !isNaN(Date.parse(options.toDate))) {

      params = params.set('to', new Date(options.toDate).toISOString());

    }

    console.log(params.keys().map(key => `${key}=${params.getAll(key)?.join(',')}`).join('&'));

    return this.http.get<Thread[]>(`${SERVER_URI}/api/threads/chunk`, { params }).pipe(      
      switchMap((response: any) => {

        console.log('Response from /chunk:', response);
      
        const threads = Array.isArray(response) ? response : response.Threads;
      
        if (!Array.isArray(threads)) {

          throw new Error('Expected threads to be an array');

        }
      
        const currentFormArray = (this.getCurrentThreads() as FormArray<FormGroup>) ?? this.fb.array([]);

        const newForms = this.toFormArray(threads) as FormArray<FormGroup>;
      
        newForms.controls.forEach((control: FormGroup) => {

          currentFormArray.push(control);

        });
      
        this.setThreads(currentFormArray);
      
        return [threads.length > 0];
        
      })

    );

  }

  getThreadByID(threadID: string): FormGroup | null {

    const threadsFormArray = this.threadsSubject.value;

    if (!threadsFormArray) return null;

    const found = threadsFormArray.controls.find(ctrl => 
      (ctrl as FormGroup).get('ThreadID')?.value === threadID
    );

    return found ? (found as FormGroup) : null;

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
  Sports = 'Sports'
}
