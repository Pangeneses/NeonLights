import { Component, EventEmitter, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { EnumArticleCategory } from '../../services/articleService/article.service';

import { UsersComponent } from '../usersComponent/users.component';
import { CalendarComponent } from '../calendarComponent/calendar.component';

@Component({
  selector: 'article-component-anav',
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
  templateUrl: './anav.component.html',
  styleUrls: ['./anav.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ANavComponent implements OnInit {

  @Output() filtersChanged = new EventEmitter<{
    ArticleCategory?: EnumArticleCategory;
    ArticleHashtags?: string[];
    ArticleUserID?: string;
    ArticleFrom?: string;
    ArticleTo?: string;
  }>();

  constructor() {}

  ngOnInit() {}

  EnumArticleCategory = EnumArticleCategory;
  categoryOptions = Object.values(EnumArticleCategory).map((value) => ({
    label: value,
    value: value,
  }));
  selectedCategory: EnumArticleCategory = EnumArticleCategory.Unspecified;

  categoryTrackFn(index: number, category: { label: string; value: EnumArticleCategory }): string {
    return category.value;
  }

  onCategoryChange(category: EnumArticleCategory) {

    this.selectedCategory = category;

    this.fetchArticles();

  }

  hashtags = '';

  formatHashtags() {
    this.hashtags = this.hashtags
      .split(/\s+/)
      .map((tag) => (tag.startsWith('#') ? tag : '#' + tag))
      .map((tag) => tag.replace(/[^#a-zA-Z0-9]/g, ''))
      .join(' ');

    this.fetchArticles();
  }

  selectedUser = '';

  onSelectedUserChange(user: string): void {

    this.selectedUser = user;

    this.fetchArticles();

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

      this.fetchArticles();

    } else {

      this.dateRange.start = date;

    }

  }

  dateClass = (date: Date): string => {

    let { start, end } = this.dateRange;

    console.log(this.dateRange);

    if (!start) return '';

    const day = new Date(date).setHours(0, 0, 0, 0);

    let startTime = start.setHours(0, 0, 0, 0);

    let endTime = end?.setHours(0, 0, 0, 0);

    if (startTime && endTime && startTime > endTime) {

      [startTime, endTime] = [endTime, startTime];

    }

    if (day === startTime) return 'date-start';

    if (day === endTime) return 'date-end';

    if (endTime && day > startTime && day < endTime) return 'date-range-middle';

    return '';

  }

  private fetchTimer: ReturnType<typeof setTimeout> | null = null;

  fetchArticles() {

    if (this.fetchTimer !== null) {

      clearTimeout(this.fetchTimer);

    }

    this.fetchTimer = setTimeout(() => {
      
      const tagList = this.hashtags.split(/\s+/).filter((tag) => tag.startsWith('#'));

      const ArticleFrom = this.dateRange.start?.toISOString();

      const ArticleTo = this.dateRange.end?.toISOString();

      this.filtersChanged.emit({
        ArticleCategory: this.selectedCategory !== EnumArticleCategory.Unspecified ? this.selectedCategory : undefined,
        ArticleHashtags: tagList.length > 0 ? tagList : undefined,
        ArticleUserID: this.selectedUser || undefined,
        ArticleFrom,
        ArticleTo
      });

    }, 250);

  }

}
