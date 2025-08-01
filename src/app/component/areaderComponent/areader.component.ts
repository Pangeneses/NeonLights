import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { ArticleService } from '../../services/articleService/article.service';
import { HeaderComponent } from '../../component/headerComponent/header.component';
import { FooterComponent } from '../../component/footerComponent/footer.component';

import { SERVER_URI } from '../../../../environment';

@Component({
  selector: 'areader-component-reader',
  imports: [
    HeaderComponent, 
    FooterComponent, 
    RouterLink, 
    RouterLinkActive, 
    MatIconModule],
  templateUrl: './areader.component.html',
  styleUrls: ['./areader.component.scss'],
})
export class AReaderComponent implements OnInit {

  SERVER_URI = SERVER_URI;

  CurrentArticle: any | null = null;

  loading = true;

  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {

      const articleID = params['id'];

      if (articleID) {

        this.loadArticle(articleID);

      } else {

        this.error = 'No Article ID provided.';

        this.loading = false;

      }

    });

  }

  loadArticle(articleID: string) {

    this.loading = true;

    const articleData = this.articleService.getArticleByID(articleID);

    if (articleData) {
      
      this.CurrentArticle = articleData;
      
      this.loading = false;

    } else {
      
      this.error = 'Article not found.';

      this.loading = false;

    }

  }

}
