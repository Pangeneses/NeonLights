import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './component/loginComponent/login.component';
import { NewUserComponent } from './component/newUserComponent/new.user.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [NgIf, RouterOutlet, LoginComponent, NewUserComponent, MatIconModule, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Red Dragon Society';

  isLanding = true;
  isEnter = false;
  isLogin = false;
  isNew = false;
  isLoaded = false;

  LandingURL = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.isLanding = true;
      this.isEnter = false;
      this.isLogin = false;
      this.isNew = false;
      this.isLoaded = false;

      this.animateLoading();
    } else {
      this.isLanding = false;
      this.isEnter = false;
      this.isLogin = false;
      this.isNew = false;
      this.isLoaded = true;
    }
  }

  async animateLoading() {
    for (let i = 1; i <= 53; i++) {
      const paddedNumber = i.toString().padStart(3, '0');

      this.LandingURL = `Landing/Landing${paddedNumber}.png`;

      this.cdr.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.isEnter = true;

    this.cdr.detectChanges();
  }

  navLogin(): void {
    this.isLanding = false;
    this.isEnter = false;
    this.isLogin = true;
    this.isNew = false;
    this.isLoaded = false;
  }

  onLogin(): void {
    this.isLanding = false;
    this.isEnter = false;
    this.isLogin = false;
    this.isNew = false;
    this.isLoaded = true;

    this.router.navigate(['/headlines']);
  }

  onNewUser(): void {
    this.isLanding = false;
    this.isEnter = false;
    this.isLogin = false;
    this.isNew = true;
    this.isLoaded = false;
  }
}
