import { Component, EventEmitter, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ListedUserService, ListedUser } from '../../services/usersService/users.service';
import { EnumForumCategory } from '../../services/threadService/thread.service';

@Component({
  selector: 'thread-component-fnav',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './fnav.component.html',
  styleUrls: ['./fnav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FNavComponent implements OnInit {

  @Output() filtersChanged = new EventEmitter<{
    AuthorID?: string;
    ThreadCategory?: EnumForumCategory;
    ThreadHashtags?: string[];
    fromDate?: string;
    toDate?: string;
  }>();

  categoryTrackFn(index: number, category: { label: string, value: EnumForumCategory }): string { return category.value; }

  EnumForumCategory = EnumForumCategory;
  categoryOptions = Object.values(EnumForumCategory).map(value => ({
    label: value,
    value: value
  }));
  selectedCategory: EnumForumCategory = EnumForumCategory.Unspecified;
  
  hashtags = '';
  selectedUser = '';

  dateSelected: Date | null = new Date();
  dateRange = {
    start: null,
    end: null
  } as { start: Date | null; end: Date | null };

  userTrackFn(index: number, user: ListedUser): string { return user.UserName; }

  allUsers: ListedUser[] = [];
  filteredUsers: ListedUser[] = [];

  constructor(private listedUserService: ListedUserService) { }

  ngOnInit() {

    this.listedUserService.users$.subscribe(users => {
      
      this.allUsers = users;

      this.filteredUsers = [...this.allUsers];

      this.fetchThreads();
    
    });

  }

  onCategoryChange(category: EnumForumCategory) {

    this.selectedCategory = category;

    this.fetchThreads();

  }

  formatHashtags() {

    this.hashtags = this.hashtags
      .split(/\s+/)
      .map(tag => tag.startsWith('#') ? tag : '#' + tag)
      .map(tag => tag.replace(/[^#a-zA-Z0-9]/g, ''))
      .join(' ');

    this.fetchThreads();

  }

  userRegex = '';

  searchByRegex(): void {

    if (!this.userRegex.trim()) {

      this.filteredUsers = [...this.allUsers];

      return;

    }

    try {

      const pattern = new RegExp(this.userRegex.trim(), 'i');

      this.filteredUsers = this.allUsers.filter(user => pattern.test(user.UserName));

    } catch (err) {

      console.error('Invalid regex:', err);

      this.filteredUsers = [...this.allUsers];

    }

  }

  onUserInputChange(query: string) {

    const lowerQuery = query.toLowerCase();

    this.filteredUsers = query
      ? this.allUsers.filter(user => user.UserName.toLowerCase().includes(lowerQuery))
      : [...this.allUsers];

  }

  selectUser(username: string) {

    this.selectedUser = username;

    this.fetchThreads();

  }

  calendarVisible = true;

  onCalendarDateSelect(date: Date | null) {

    if (!date) return;

    this.dateSelected = date;

    if (this.dateRange.start && this.dateRange.end) {

      this.dateRange.start = date;

      this.dateRange.end = null;

      this.calendarVisible = false;

      setTimeout(() => this.calendarVisible = true);

    } else if (this.dateRange.start && !this.dateRange.end) {

      if (date >= this.dateRange.start) {

        this.dateRange.end = date;

      } else {

        this.dateRange.end = this.dateRange.start;

        this.dateRange.start = date;

      }
      
      this.calendarVisible = false;
            
      setTimeout(() => this.calendarVisible = true);

      this.fetchThreads();

    } else {

      this.dateRange.start = date;

    }

  }

  dateClass = (date: Date): string => {

    let { start, end } = this.dateRange;

    console.log(this.dateRange);

    if (!start) return '';

    const day = date.setHours(0, 0, 0, 0);
    let startTime = start.setHours(0, 0, 0, 0);
    let endTime = end?.setHours(0, 0, 0, 0);

    if (startTime && endTime && startTime > endTime) {

      [startTime, endTime] = [endTime, startTime];

    }

    if (day === startTime) return 'date-start';
    if (day === endTime) return 'date-end';
    if (endTime && day > startTime && day < endTime) return 'date-range-middle';

    return '';

  };

  private fetchTimer: any;

  fetchThreads() {

    clearTimeout(this.fetchTimer);

    this.fetchTimer = setTimeout(() => {

      const selected = this.allUsers.find(user => user.UserName === this.selectedUser.trim());

      const authorId = selected?.ID ?? '';

      const normalizedCategory = this.selectedCategory.replace(/[\s_]/g, '');

      const tagList = this.hashtags.split(/\s+/).filter(tag => tag.startsWith('#'));

      const fromDate = this.dateRange.start?.toISOString();

      const toDate = this.dateRange.end?.toISOString();

      this.filtersChanged.emit({
        AuthorID: authorId || undefined,
        ThreadCategory: this.selectedCategory !== EnumForumCategory.Unspecified ? this.selectedCategory : undefined,
        ThreadHashtags: tagList.length > 0 ? tagList : undefined,
        fromDate,
        toDate
      });

    }, 250);

  }

}