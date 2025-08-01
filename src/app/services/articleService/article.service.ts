import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

import { SERVER_URI } from '../../../../environment';

export interface Article {
  ArticleID: string;
  ArticleUserID: string;
  ArticleTitle: string;
  ArticleBody: string;
  ArticleImage: string;
  ArticleDate: string;
  ArticleCategory: EnumArticleCategory;
  ArticleHashtags: string[];
}

export interface ArticleExtended extends Article {
  ArticleUserName: string;
  ArticleFirst: string;
  ArticleLast: string;
  ArticleJournal: string;
}

export interface ArticlesResponse {
  Articles: Article[];
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {

  private articlesSubject = new BehaviorSubject<ArticleExtended[]>([]);
  public articles$: Observable<ArticleExtended[]> = this.articlesSubject.asObservable();

  constructor(private http: HttpClient) {

    const savedArticles = localStorage.getItem('articles');

    if (savedArticles) {

      try {

        const data = JSON.parse(savedArticles);

        const articlesArray: ArticleExtended[] = Array.isArray(data)
          ? data.map((item: any) => this.normalizeArticle(item))
          : [];

        this.articlesSubject.next(articlesArray);

      } catch (err) {

        console.error('Failed to parse saved articles:', err);

        this.articlesSubject.next([]);

      }

    }

  }

  private normalizeArticle(data: any): ArticleExtended {

    return {
      ArticleID: data.ArticleID ?? '',
      ArticleUserID: data.ArticleUserID ?? '',
      ArticleUserName: data.ArticleUserName ?? '',
      ArticleFirst: data.ArticleUserFirst ?? '',
      ArticleLast: data.ArticleUserLast ?? '',
      ArticleJournal: data.ArticleJournal ?? '',
      ArticleTitle: data.ArticleTitle ?? '',
      ArticleBody: data.ArticleBody ?? '',
      ArticleImage: data.ArticleImage ?? '',
      ArticleDate: data.ArticleDate ?? new Date().toISOString(),
      ArticleCategory: data.ArticleCategory ?? EnumArticleCategory.Unspecified,
      ArticleHashtags: Array.isArray(data.ArticleHashtags) ? data.ArticleHashtags : [],
    };

  }

  setArticles(articlesArray: ArticleExtended[]) {

    localStorage.setItem('articles', JSON.stringify(articlesArray));

    this.articlesSubject.next(articlesArray);

  }

  clearArticles() {

    localStorage.removeItem('articles');

    this.articlesSubject.next([]);

  }

  getCurrentArticles(): ArticleExtended[] | null {

    return this.articlesSubject.value;

  }

  getArticleByID(articleID: string): ArticleExtended | null {

    const articles = this.getCurrentArticles();

    return articles?.find((article) => article.ArticleID === articleID) ?? null;

  }

  fetchArticleChunk(options: {
    limit: number;
    lastID?: string;
    direction?: 'up' | 'down';
    ArticleUserID?: string;
    ArticleCategory?: EnumArticleCategory;
    ArticleHashtags?: string[];
    ArticleFrom?: string;
    ArticleTo?: string;
  }): Observable<boolean> {

    let params = new HttpParams().set('limit', options.limit.toString());

    if (options.lastID) params = params.set('lastID', options.lastID);

    if (options.direction) params = params.set('direction', options.direction);

    if (options.ArticleUserID) params = params.set('ArticleUserID', options.ArticleUserID);

    if (options.ArticleCategory && options.ArticleCategory !== EnumArticleCategory.Unspecified) {

      params = params.set('ArticleCategory', options.ArticleCategory.replace(/[\s_]/g, ''));

    }

    if (options.ArticleHashtags?.length) {

      for (const tag of options.ArticleHashtags) {

        if (tag.trim()) {

          params = params.append('ArticleHashtags', tag.trim());

        }

      }

    }

    if (options.ArticleFrom && !isNaN(Date.parse(options.ArticleFrom))) {

      params = params.set('ArticleFrom', new Date(options.ArticleFrom).toISOString());

    }

    if (options.ArticleTo && !isNaN(Date.parse(options.ArticleTo))) {

      params = params.set('ArticleTo', new Date(options.ArticleTo).toISOString());

    }

    return this.http.get<ArticleExtended[]>(`${SERVER_URI}/api/articles/chunk`, { params }).pipe(
      switchMap((response: any) => {

        const articles = Array.isArray(response) ? response : response.Articles;

        if (!Array.isArray(articles)) {

          throw new Error('Expected articles to be an array');

        }

        const newArticles = Array.isArray(articles) ? articles.map(this.normalizeArticle) : [];

        if (newArticles.length > 0) {

          this.clearArticles();

          this.setArticles(newArticles);

        }
        else {

          //end of articles

        }

        return [articles.length > 0];

      }),

    );

  }

  postArticle(articleData: Article): Observable<any> {

    return this.http.post(`${SERVER_URI}/api/articles`, articleData);

  }

}

export enum EnumArticleCategory {
  Unspecified = 'Unspecified',
  RedDragonSociety = 'Red Dragon Society',
  PoliticalSci = 'Political Science',
  SocialSci = 'Social Science',
  Economics = 'Economics',
  DataSci = 'Data Science',
  Philosophy = 'Philosophy',
  Theology = 'Theology',
  Law = 'Law',
  History = 'History',
  Anthropology = 'Anthropology',
  Archeology = 'Archeology',
  Languages = 'Languages',
  Pedagogy = 'Pedagogy',
  Medicine = 'Medicine',
  Biology = 'Biology',
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Math = 'Math',
  Climatology = 'Climatology',
  Astronomy = 'Astronomy',
  MechanicalEng = 'Mechanical Engineering',
  ElectricalEng = 'Electrical Engineering',
  SoftwareEng = 'Software Engineering',
  Trades = 'Trades',
  Business = 'Business',
  Theater = 'Theater',
  FineArt = 'Fine Art',
  ArtHistory = 'Art History',
  Writting = 'Writting',
  Crafting = 'Crafting',
  Cooking = 'Cooking',
  Film = 'Film',
  TV = 'TV',
  Gaming = 'Gaming',
  Sports = 'Sports',
}
