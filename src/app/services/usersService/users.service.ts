import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SERVER_URI } from '../../../../environment';

export interface ListedUser {
  ID: string;
  UserName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListedUserService {

  private usersSubject = new BehaviorSubject<ListedUser[]>([]);
  public users$: Observable<ListedUser[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  fetchUsers(): void {

    this.http.get<any[]>(`${SERVER_URI}/api/users/listed`).pipe(
      map((users) =>
        users.map(user => ({
          ID: user.ID,
          UserName: user.UserName
        }))
      )
    ).subscribe({
      next: (simplified) => this.usersSubject.next(simplified),
      error: (err) => {
        console.error('Failed to fetch listed users:', err);
        this.usersSubject.next([]);
      }
    });

  }

  getUsers(): ListedUser[] {

    return this.usersSubject.value;

  }

}