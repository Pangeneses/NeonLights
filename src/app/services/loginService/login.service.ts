import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { SERVER_URI } from '../../../../environment';

import { UserService } from '../../services/userService/user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginUserService implements OnInit {
  userForm: FormGroup | null = null;

  constructor(
    public userService: UserService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe((userForm) => {
      this.userForm = userForm;
    });
  }

  loginUser(userName: string, userPassword: string): Promise<boolean> {
    const formGroup = this.userService.formBuilder();

    console.log(SERVER_URI);

    return new Promise<boolean>((resolve, reject) => {
      this.http
        .post<any>(`${SERVER_URI}/api/users/auth/login`, {
          UserName: userName,
          Password: userPassword,
        })
        .subscribe({
          next: (res) => {
            if (res.success) {
              formGroup.patchValue(res.user);

              this.userService.setCurrentUser(formGroup);

              resolve(true);
            } else {
              resolve(false);
            }
          },
          error: (err) => {
            console.error('User fetch error:', err);

            reject(err);
          },
        });
    });
  }
}
