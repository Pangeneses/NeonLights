import { Component, EventEmitter, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { EnumForumCategory } from '../../services/threadService/thread.service';

import { UsersComponent } from '../usersComponent/users.component';
import { CalendarComponent } from '../calendarComponent/calendar.component';

@Component({
  selector: 'thread-component-fnav',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    UsersComponent,
    CalendarComponent,
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

  constructor() { }

  ngOnInit() { }

  EnumForumCategory = EnumForumCategory;
  categoryOptions = Object.values(EnumForumCategory).map((value) => ({
    label: value,
    value: value,
  }));
  selectedCategory: EnumForumCategory = EnumForumCategory.Unspecified;

  categoryTrackFN(index: number, category: { label: string; value: EnumForumCategory }): string {
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

  dateRange: { FromDate: Date | null; ToDate: Date | null } = {
    FromDate: null,
    ToDate: null
  };

  onDateRangeUpdate(filters: {
    FromDate: Date;
    ToDate: Date;
  }): void {

    this.dateRange.FromDate = filters.FromDate;

    this.dateRange.ToDate = filters.ToDate;

    this.fetchThreads();

  }

  private fetchTimer: ReturnType<typeof setTimeout> | null = null;

  fetchThreads() {

    if (this.fetchTimer !== null) {

      clearTimeout(this.fetchTimer);

    }

    this.fetchTimer = setTimeout(() => {

      const tagList = this.hashtags.split(/\s+/).filter((tag) => tag.startsWith('#'));

      const ThreadFrom = this.dateRange.FromDate?.toISOString();

      const ThreadTo = this.dateRange.ToDate?.toISOString();

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
