import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { SERVER_URI } from '../../../../environment';

export interface User {
    UserID: string;
    UserName: string;
}

@Injectable({
    providedIn: 'root',
})
export class UsersService {

    private currentUsersSubject = new BehaviorSubject<User[]>([]);

    public currentUsers$: Observable<User[]> = this.currentUsersSubject.asObservable();

    constructor(private http: HttpClient) {

        const savedUsers = localStorage.getItem('currentUsers');

        try {

            if (savedUsers) {

                const data = JSON.parse(savedUsers);

                if (Array.isArray(data)) {

                    this.currentUsersSubject.next(data as User[]);

                }

            }

        } catch (e) {

            console.error('Failed to parse savedUsers:', e);

        }

    }

    setCurrentUsers(users: User[]) {

        localStorage.setItem('currentUsers', JSON.stringify(users));

        this.currentUsersSubject.next(users);

    }

    clearCurrentUsers() {

        localStorage.removeItem('currentUsers');

        this.currentUsersSubject.next([]);

    }

    getCurrentUsers(): User[] {

        return this.currentUsersSubject.value;

    }

    getUsersChunk(regex: string, cursor: string | null, direction: 'up' | 'down') {

        const params = new HttpParams()
            .set('regex', regex)
            .set('cursor', cursor || '')
            .set('dir', direction);

        const observable = this.http.get<User[]>(`${SERVER_URI}/api/users/search`, { params });

        observable.subscribe({
            next: (users) => this.setCurrentUsers(users),
            error: (err) => console.error('Failed to fetch users chunk:', err),
        });

        return observable;

    }

}
