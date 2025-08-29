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

  constructor() { }

  ngOnInit() { }

  EnumArticleCategory = EnumArticleCategory;
  categoryOptions = Object.values(EnumArticleCategory).map((value) => ({
    label: value,
    value: value,
  }));
  selectedCategory: EnumArticleCategory = EnumArticleCategory.Unspecified;

  categoryTrackFN(index: number, category: { label: string; value: EnumArticleCategory }): string {
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

    this.fetchArticles();

  }

  private fetchTimer: ReturnType<typeof setTimeout> | null = null;

  fetchArticles() {

    if (this.fetchTimer !== null) {

      clearTimeout(this.fetchTimer);

    }

    this.fetchTimer = setTimeout(() => {

      const tagList = this.hashtags.split(/\s+/).filter((tag) => tag.startsWith('#'));

      const ArticleFrom = this.dateRange.FromDate?.toISOString();

      const ArticleTo = this.dateRange.ToDate?.toISOString();

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
