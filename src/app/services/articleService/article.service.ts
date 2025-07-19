import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

import { ListedUserService, ListedUser } from '../usersService/users.service';

import { SERVER_URI } from '../../../../environment';

export interface Article {
  ArticleID:       string;
  AuthorID: string | { _id: string, UserName: string }               
  ArticleTitle:    string;         
  ArticleBody:     string;
  ArticleImage:    string;
  ArticleDate:     string;     
  ArticleCategory: EnumArticleCategory;          
  ArticleHashtags: string[];            
}

export interface ArticleWithUserName extends Article {
  AuthorName?: string;
}

export interface ArticlesResponse {
  Articles: Article[];
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {

  private articlesSubject = new BehaviorSubject<FormArray | null>(null);

  public articles$: Observable<FormArray | null> = this.articlesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: ListedUserService,
    private fb: FormBuilder) {

    const savedArticles = localStorage.getItem('articles');

    if (savedArticles) {

      const data = JSON.parse(savedArticles);

      const articlesFormArray = this.toFormArray(data);

      this.articlesSubject.next(articlesFormArray);

    }

  }

  getListedUsers(): ListedUser[] {
    
    return this.userService.getUsers();

  }

  createArticleForm(): FormGroup {

    return this.fb.group({
      ArticleID:        [''],
      AuthorID:         [''],
      ArticleTitle:     ['', { validators: [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9.\\- ]+$')], updateOn: 'blur' }],
      ArticleBody:      ['', { validators: [Validators.required, Validators.minLength(500)], updateOn: 'blur' }],
      ArticleImage:     [''],
      ArticleDate:      ['', { validators: [Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)], updateOn: 'blur' }],
      ArticleCategory:  [EnumArticleCategory.Unspecified],
      ArticleHashtags:  [[]]
    });

  }

  toForm(article: any): FormGroup {

    return this.fb.group({
      ArticleID:        [article.ArticleID],
      AuthorID:         [article.AuthorID],
      ArticleTitle:     [article.ArticleTitle],
      ArticleBody:      [article.ArticleBody],
      ArticleImage:     [article.ArticleImage],
      ArticleDate:      [article.ArticleDate],
      ArticleCategory:  [article.ArticleCategory],
      ArticleHashtags:  [article.ArticleHashtags || []]
    });

  }

  toFormArray(articles: any[]): FormArray {

    const formGroups = articles.map(article => this.toForm(article));

    return this.fb.array(formGroups);

  }

  setArticles(formArray: FormArray) {

    localStorage.setItem('articles', JSON.stringify(formArray.getRawValue()));

    this.articlesSubject.next(formArray);

  }

  clearArticles() {

    localStorage.removeItem('articles');

    this.articlesSubject.next(this.fb.array([]));

  }

  getCurrentArticles(): FormArray | null {

    return this.articlesSubject.value;

  }

  postArticle(articleData: Article): Observable<any> {
    
    return this.http.post(`${SERVER_URI}/api/articles`, articleData);

  }

  fetchArticleChunk(options: {
    limit: number;
    lastId?: string;
    direction?: 'up' | 'down';
    AuthorID?: string | string[];
    ArticleCategory?: EnumArticleCategory;
    ArticleHashtags?: string[];
    fromDate?: string;
    toDate?: string;
  }): Observable<boolean> {

    let params = new HttpParams().set('limit', options.limit.toString());

    if (options.lastId) {

      params = params.set('lastId', options.lastId);

    }

    if (options.direction) {

      params = params.set('direction', options.direction);

    }

    if (Array.isArray(options.AuthorID)) {

      for (const id of options.AuthorID) {

        if (id.trim()) {

          params = params.append('AuthorID', id.trim());

        }

      }

    } else if (typeof options.AuthorID === 'string' && options.AuthorID.trim()) {

      params = params.set('AuthorID', options.AuthorID.trim());

    }

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

    if (options.fromDate && !isNaN(Date.parse(options.fromDate))) {

      params = params.set('from', new Date(options.fromDate).toISOString());

    }

    if (options.toDate && !isNaN(Date.parse(options.toDate))) {

      params = params.set('to', new Date(options.toDate).toISOString());

    }

    console.log(params.keys().map(key => `${key}=${params.getAll(key)?.join(',')}`).join('&'));

    return this.http.get<Article[]>(`${SERVER_URI}/api/articles/chunk`, { params }).pipe(      
      switchMap((response: any) => {

        console.log('Response from /chunk:', response);
      
        const articles = Array.isArray(response) ? response : response.Articles;
      
        if (!Array.isArray(articles)) {

          throw new Error('Expected articles to be an array');

        }
      
        const currentFormArray = (this.getCurrentArticles() as FormArray<FormGroup>) ?? this.fb.array([]);

        const newForms = this.toFormArray(articles) as FormArray<FormGroup>;
      
        newForms.controls.forEach((control: FormGroup) => {

          currentFormArray.push(control);

        });
      
        this.setArticles(currentFormArray);
      
        return [articles.length > 0];
        
      })

    );

  }

  getArticleByID(articleID: string): FormGroup | null {

    const articlesFormArray = this.articlesSubject.value;

    if (!articlesFormArray) return null;

    const found = articlesFormArray.controls.find(ctrl => 
      (ctrl as FormGroup).get('ArticleID')?.value === articleID
    );

    return found ? (found as FormGroup) : null;

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
  Sports = 'Sports'
}
