import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from '../headerComponent/header.component';
import { ANavComponent } from '../anavComponent/anav.component';
import { FooterComponent } from '../footerComponent/footer.component';

import { ArticleService, ArticleExtended, EnumArticleCategory } from '../../services/articleService/article.service';

import { environment } from '../../../environments/environment';

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
    MatIconModule],
  templateUrl: './aindex.component.html',
  styleUrl: './aindex.component.scss',
})
export class AIndexComponent implements OnInit {

  IMAGE_REPO = environment.IMAGE_REPO;

  articleChunk: ArticleExtended[] = [];

  isLoading = false;

  hasMore = true;

  limit = 10;

  readonly lastCursor = computed(() => {

    const articles = this.articleChunk;

    return articles.length > 0 ? ((articles.at(-1) as any)?._id ?? '') : '';

  });

  readonly firstCursor = computed(() => {

    const articles = this.articleChunk;

    return articles.length > 0 ? ((articles.at(0) as any)?._id ?? '') : '';

  });

  articleTrackFN(index: number, article: ArticleExtended): string {
    return article.ArticleID;
  }

  constructor(
    private router: Router,
    private articleService: ArticleService,
  ) { }

  ngOnInit(): void {


  }

  onFiltersChanged(filters: {
    ArticleUserID?: string;
    ArticleCategory?: EnumArticleCategory;
    ArticleHashtags?: string[];
    ArticleFrom?: string;
    ArticleTo?: string;
  }): void {

    this.hasMore = true;

    this.articleService.clearArticles();

    this.articleService.fetchArticleChunk({
      limit: this.limit,
      lastID: undefined,
      ...filters,
    })
      .subscribe((hasMore) => {

        const articles = this.articleService.getCurrentArticles();

        if (articles) {

          this.articleChunk = articles || [];

        }

      }

      );

  }

  loadOlder(): void {

    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    this.articleService.fetchArticleChunk({
      limit: this.limit,
      lastID: this.lastCursor(),
      direction: 'down',
    })
      .subscribe({
        next: (hasMore) => {

          this.hasMore = hasMore;

          this.isLoading = false;

        },
        error: (err) => {

          console.error('Error fetching older articles:', err);

          this.isLoading = false;

        },

      }

      );

  }

  loadNewer(): void {

    if (this.isLoading) return;

    this.isLoading = true;

    this.articleService
      .fetchArticleChunk({
        limit: this.limit,
        lastID: this.firstCursor(),
        direction: 'up',
      })
      .subscribe({
        next: (hasMore) => {

          this.isLoading = hasMore;

          this.isLoading = false;

        },
        error: (err) => {

          console.error('Error fetching newer articles:', err);

          this.isLoading = false;

        },

      }

      );

  }

  loadMore(): void {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    this.articleService
      .fetchArticleChunk({
        limit: this.limit,
        lastID: this.lastCursor(),
      })
      .subscribe({
        next: (hasMore) => {

          this.hasMore = hasMore;

          this.isLoading = false;

        },
        error: (err) => {

          console.error('Failed to fetch more articles:', err);

          this.isLoading = false;

        },

      }

      );

  }

  readArticle(articleID: string) {
    this.router.navigate(['/areader'], { queryParams: { id: articleID } });
  }

}
