import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LoginUserService } from '../../services/loginService/login.service';

@Component({
  selector: 'app-component-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginUserService: LoginUserService,
  ) {

    this.loginForm = this.formBuilder.group({
      UserName: [''],
      Password: [''],
    });

  }

  ngOnInit(): void {}

  isLoginFailed = false;

  @Output() login = new EventEmitter<void>();

  async onLogin(): Promise<void> {

    const userName = this.loginForm.get('UserName')?.value;
    const password = this.loginForm.get('Password')?.value;

    try {

      const success = await this.loginUserService.loginUser(userName, password);

      if (success) {

        this.login.emit();

      } else {

        alert('UserName or Password Invalid');

        console.log(success);

      }
    } catch (err) {

      console.error('Login error:', err);

      alert('Login failed due to server error.');

    }

  }

  @Output() newuser = new EventEmitter<void>();

  onNewUser(): void {

    this.newuser.emit();

  }
  
}
