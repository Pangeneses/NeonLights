import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { ArticleService } from '../../services/articleService/article.service';
import { UserService } from '../../services/userService/user.service';
import { HeaderComponent } from '../../component/headerComponent/header.component';
import { FooterComponent } from '../../component/footerComponent/footer.component';

import { SERVER_URI } from '../../../../environment'

@Component({
  selector: 'areader-component-reader',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './areader.component.html',
  styleUrls: ['./areader.component.scss']
})
export class AReaderComponent implements OnInit {

  SERVER_URI = SERVER_URI;

  article: any | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const articleId = params['id'];

      if (articleId) {

        this.loadArticle(articleId);

      } else {

        this.error = 'No Article ID provided.';

        this.loading = false;

      }

    });

  }

  loadArticle(articleId: string) {

    this.loading = true;

    const articleFormGroup = this.articleService.getArticleByID(articleId);

    if (articleFormGroup) {

      const articleData = articleFormGroup.getRawValue();

      const authorId = typeof articleData.AuthorID === 'string'
        ? articleData.AuthorID
        : articleData.AuthorID?._id;

      if (authorId) {

        this.userService.getUserById(authorId).subscribe({
          next: user => {
        
            articleData.AuthorUser = user ?? null;
        
            this.article = articleData;
        
            this.loading = false;

          },
          error: err => {
            
            console.error('Failed to fetch author:', err);
            
            this.article = articleData;
            
            this.loading = false;

          }

        });

      } else {

        this.article = articleData;

        this.loading = false;

      }

    } else {
      
      this.error = 'Article not found.';

      this.loading = false;

    }
    
  }

}
