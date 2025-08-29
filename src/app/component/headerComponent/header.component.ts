import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/userService/user.service';
import { UserComponent } from '../userComponent/user.component';

@Component({
  selector: 'app-component-header',
  imports: [MatIcon, UserComponent, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  userForm: FormGroup | null = null;

  usersName = '';

  constructor(
    private router: Router,
    public userService: UserService,
  ) {}

  ngOnInit(): void {

    this.userService.currentUser$.subscribe((userForm) => {

      this.userForm = userForm;

    });

    const first = this.userForm?.get('FirstName')?.value || '';
    const last = this.userForm?.get('LastName')?.value || '';

    this.usersName = `${first} ${last}`.trim();

    if (this.router.url === '/headlines' || this.router.url === '') {

      this.isHome = true;

    } else {

      this.isHome = false;

    }

  }

  isHome = true;

  onNavigate001(): void {

    this.router.navigate(['/findex']);

    this.isHome = false;

  }

  onNavigate002(): void {

    this.router.navigate(['/aindex']);

    this.isHome = false;

  }

  onNavigate003(): void {

    this.router.navigate(['/featured']);

    this.isHome = false;

  }

  onNavigate004(): void {

    this.router.navigate(['/headlines']);

    this.isHome = true;

  }

  isHoverUser = false;

  isHoverUserDropDown = false;

  isUserForm = false;

  onUserForm(): void {

    this.isHoverUser = false;

    this.isHoverUserDropDown = false;

    this.isUserForm = !this.isUserForm;

  }
  
}
