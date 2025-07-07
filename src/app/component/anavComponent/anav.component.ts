import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ListedUserService } from '../../services/usersService/users.service';
import { UserService } from '../../services/userService/user.service';
import { ArticleService, Article, EnumArticleCatagory } from '../../services/articleService/article.service';

@Component({
  selector: 'article-component-anav',
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
  templateUrl: './anav.component.html',
  styleUrls: ['./anav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ANavComponent implements OnInit {

  EnumArticleCatagory = EnumArticleCatagory;
  categoryOptions = Object.values(EnumArticleCatagory).map(value => ({
    label: value,
    value: value
  }));
  selectedCategory: EnumArticleCatagory = EnumArticleCatagory.Any;
  
  selectedUser = '';
  hashtags = '';

  dateSelected: Date | null = new Date();
  dateRange = {
    start: new Date(),
    end: new Date()
  } as { start: Date | null; end: Date | null };

  articles: Article[] = [];
  allUsers: string[] = [];
  filteredUsers: string[] = [];

  constructor(
    private listedUserService: ListedUserService,
    private userService: UserService,
    private articleService: ArticleService
  ) { }

  ngOnInit() {

    this.listedUserService.users$.subscribe(users => {
    console.log('Fetched users:', users);
      this.allUsers = users.map(user => user.UserName);
      this.filteredUsers = [...this.allUsers];
    });

    this.fetchArticles();

  }

  onUserInputChange(query: string) {

    const lowerQuery = query.toLowerCase();

    this.filteredUsers = query
      ? this.allUsers.filter(user => user.toLowerCase().includes(lowerQuery))
      : [...this.allUsers];

  }

  formatHashtags() {

    this.hashtags = this.hashtags
      .split(/\s+/)
      .map(tag => tag.startsWith('#') ? tag : '#' + tag)
      .map(tag => tag.replace(/[^#a-zA-Z0-9]/g, ''))
      .join(' ');

    this.fetchArticles();

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

      this.fetchArticles();

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

  fetchArticles() {
    const fromDate = this.dateRange.start?.toISOString();
    const toDate = this.dateRange.end?.toISOString();

    const tagList = this.hashtags
      .split(/\s+/)
      .filter(tag => tag.startsWith('#'));

    this.articleService.getArticles({
      category: this.selectedCategory !== EnumArticleCatagory.Any ? this.selectedCategory : undefined,
      username: this.selectedUser.trim() || undefined,
      hashtags: tagList.length > 0 ? tagList : undefined,
      fromDate,
      toDate
    }).subscribe(res => {
      this.articles = res.sort((a, b) =>
        new Date(b.PublishedDate).getTime() - new Date(a.PublishedDate).getTime()
      );
    });
  }
}