import { Component, EventEmitter, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { EnumForumCategory } from '../../services/threadService/thread.service';

import { UsersComponent } from '../usersComponent/users.component';

@Component({
  selector: 'thread-component-fnav',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    UsersComponent,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
  templateUrl: './fnav.component.html',
  styleUrls: ['./fnav.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FNavComponent implements OnInit {

  @Output() filtersChanged = new EventEmitter<{
    ThreadCategory?: EnumForumCategory;
    ThreadHashtags?: string[];
    ThreadUserID?: string;
    ThreadFrom?: string;
    ThreadTo?: string;
  }>();

  constructor() {}

  ngOnInit() {}

  EnumForumCategory = EnumForumCategory;
  categoryOptions = Object.values(EnumForumCategory).map((value) => ({
    label: value,
    value: value,
  }));
  selectedCategory: EnumForumCategory = EnumForumCategory.Unspecified;

  categoryTrackFn(index: number, category: { label: string; value: EnumForumCategory }): string {
    return category.value;
  }

  onCategoryChange(category: EnumForumCategory) {

    this.selectedCategory = category;

    this.fetchThreads();

  }

  hashtags = '';

  formatHashtags() {
    this.hashtags = this.hashtags
      .split(/\s+/)
      .map((tag) => (tag.startsWith('#') ? tag : '#' + tag))
      .map((tag) => tag.replace(/[^#a-zA-Z0-9]/g, ''))
      .join(' ');

    this.fetchThreads();
  }

  selectedUser = '';

  onSelectedUserChange(user: string): void {

    this.selectedUser = user;

    this.fetchThreads();

  }

  calendarVisible = true;

  dateSelected: Date | null = new Date();
  dateRange = {
    start: null,
    end: null,
  } as { start: Date | null; end: Date | null };

  onCalendarDateSelect(date: Date | null) {

    if (!date) return;

    this.dateSelected = date;

    if (this.dateRange.start && this.dateRange.end) {

      this.dateRange.start = date;

      this.dateRange.end = null;

      this.calendarVisible = false;

      setTimeout(() => (this.calendarVisible = true));

    } else if (this.dateRange.start && !this.dateRange.end) {

      if (date >= this.dateRange.start) {

        this.dateRange.end = date;

      } else {

        this.dateRange.end = this.dateRange.start;

        this.dateRange.start = date;

      }

      this.calendarVisible = false;

      setTimeout(() => (this.calendarVisible = true));

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

  private fetchTimer: ReturnType<typeof setTimeout> | null = null;

  fetchThreads() {

    if (this.fetchTimer !== null) {

      clearTimeout(this.fetchTimer);

    }

    this.fetchTimer = setTimeout(() => {
      
      const tagList = this.hashtags.split(/\s+/).filter((tag) => tag.startsWith('#'));

      const ThreadFrom = this.dateRange.start?.toISOString();

      const ThreadTo = this.dateRange.end?.toISOString();

      this.filtersChanged.emit({
        ThreadCategory: this.selectedCategory !== EnumForumCategory.Unspecified ? this.selectedCategory : undefined,
        ThreadHashtags: tagList.length > 0 ? tagList : undefined,
        ThreadUserID: this.selectedUser || undefined,
        ThreadFrom,
        ThreadTo
      });
    }, 250);
  }
}
