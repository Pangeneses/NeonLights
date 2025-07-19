import { Component, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from '../headerComponent/header.component';
import { ANavComponent } from '../anavComponent/anav.component';
import { FooterComponent } from '../footerComponent/footer.component';

import { ArticleService, Article, ArticleWithUserName, EnumArticleCategory } from '../../services/articleService/article.service';

import { SERVER_URI } from '../../../../environment'

@Component({
  selector: 'article-component-aindex',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ANavComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './aindex.component.html',
  styleUrl: './aindex.component.scss'
})
export class AIndexComponent {

  SERVER_URI = SERVER_URI;

  readonly allArticles = signal<ArticleWithUserName[]>([]);
  
  readonly isLoading = signal(false);
  readonly hasMore = signal(true);

  readonly limit = 10;
  readonly lastCursor = computed(() => {

    const articles = this.allArticles();

    return articles.length > 0 ? (articles.at(-1) as any)?._id ?? '' : '';

  });

  articleTrackFn(index: number, article: Article): string {

    return (article as any)?._id ?? article.ArticleTitle;

  }

  constructor(
    private router: Router,
    private articleService: ArticleService) {
    
    this.articleService.articles$.subscribe(formArray => {
    
      if (formArray instanceof FormArray) {
      
        const rawArticles = formArray.getRawValue();
      
        const populated = rawArticles.map((a: Article) => ({
          ...a,
          AuthorName: typeof a.AuthorID === 'object' ? a.AuthorID.UserName : 'Unknown Author'
        }));
      
        this.allArticles.set(populated);
      
      } else {
        this.allArticles.set([]);
      }
    
    });
  
  }

  onFiltersChanged(filters: {    
    AuthorID?: string;
    ArticleCategory?: EnumArticleCategory;
    ArticleHashtags?: string[];
    fromDate?: string;
    toDate?: string;
  }): void {

    this.hasMore.set(true);

    this.articleService.clearArticles();

    this.articleService.fetchArticleChunk({
      limit: this.limit,
      lastId: undefined,
      ...filters
    }).subscribe(hasMore => {

      this.hasMore.set(hasMore);

    });

  }

  loadMore(): void {

    if (this.isLoading() || !this.hasMore()) return;

    this.isLoading.set(true);

    this.articleService.fetchArticleChunk({
      limit: this.limit,
      lastId: this.lastCursor()
    }).subscribe({
      next: hasMore => {

        this.hasMore.set(hasMore);

        this.isLoading.set(false);        

      },
      error: err => {

        console.error('Failed to fetch more articles:', err);

        this.isLoading.set(false);

      }

    });

  }

  readArticle(articleID: string){

    this.router.navigate(['/areader'], { queryParams: { id: articleID } });

  }

}
