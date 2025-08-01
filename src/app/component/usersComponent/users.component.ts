import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

import { UserService } from '../../services/userService/user.service';

@Component({
  selector: 'app-component-users',
  imports: [FormsModule, MatIcon],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @Output() userSelected = new EventEmitter<string>();

  userRegex = '';
  filteredUsers: any[] = [];

  private scrollCursor: string | null = null; // ID of last fetched user
  private fetching = false;
  private scrollDirection: 'up' | 'down' = 'down';

  trackUserFn(index: number, user: { UserID: string }) {
    return user.UserID;
  }

  constructor(private userService: UserService) {}

  ngOnInit(): void {

  }

  onRegexInput(): void {

    this.selectedUserID = '';

    this.scrollCursor = null;

    this.filteredUsers = [];

    this.search();

  }

  search(): void {

    if (this.fetching) return;

    this.fetching = true;

    this.userService.getUsersChunk(this.userRegex, this.scrollCursor, this.scrollDirection).subscribe((users) => {

      if (this.scrollDirection === 'down') {

        this.filteredUsers.push(...users);

      } else {

        this.filteredUsers.unshift(...users);

      }

      if (users.length) {

        this.scrollCursor = users[users.length - 1].UserID;

      }

      this.fetching = false;

    });

  }

  onScroll(event: Event): void {

    const target = event.target as HTMLElement;

    const scrollTop = target.scrollTop;

    const scrollHeight = target.scrollHeight;

    const offsetHeight = target.offsetHeight;

    const threshold = 100;

    if (scrollTop + offsetHeight >= scrollHeight - threshold) {

      this.onScrollDown();

    } else if (scrollTop <= threshold) {

      this.onScrollUp();

    }

  }

  onScrollDown(): void {

    this.scrollDirection = 'down';

    this.search();

  }
  
  selectedUserID: string | null = null;

  onScrollUp(): void {

    this.scrollDirection = 'up';

    this.search();

  }

  selectUser(userID: string): void {

    if(userID === '') {

      this.selectedUserID = '';

      this.userSelected.emit('');

    } else if(this.selectedUserID !== userID) {
    
      this.selectedUserID = userID;

      this.userSelected.emit(this.selectedUserID);

    } else {
    
      this.selectedUserID = '';

      this.userSelected.emit(this.selectedUserID);

    }
  
  }

}
