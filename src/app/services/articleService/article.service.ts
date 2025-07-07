import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

import { SERVER_URI } from '../../../../environment';
import { ImageService } from '../imageService/image.service';

export interface Article {
  _id:            string;               
  Title:          string;
  Author:         string;            
  UserName:       string;         
  Content:        string;
  PublishedDate:  string;     
  Category:       number;          
  Tags:           string[];            
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {

  private articlesSubject = new BehaviorSubject<FormArray | null>(null);

  public articles$: Observable<FormArray | null> = this.articlesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private imageService: ImageService) {

    const savedArticles = localStorage.getItem('articles');

    if (savedArticles) {

      const data = JSON.parse(savedArticles);

      const articlesFormArray = this.toFormArray(data);

      this.articlesSubject.next(articlesFormArray);

    }

  }

  createArticleForm(): FormGroup {

    const fb = new FormBuilder();

    return fb.group({
      ID: [''],
      Title: ['', { validators: [Validators.pattern("^$|^[a-zA-Z0-9-# ]+$")], updateOn: 'blur' }],
      Author: ['', { validators: [Validators.required] }],
      Content: ['', { validators: [Validators.pattern("^$|^[a-zA-Z0-9-# ]+$")], updateOn: 'blur' }],
      PublishedDate: ['', { validators: [Validators.pattern('^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$')], updateOn: 'blur' }],
      Category: [''],
      Tags: [[]]
    });

  }

  toForm(article: any): FormGroup {

    const fb = new FormBuilder();

    return fb.group({
      ID: [article.ID],
      Title: [article.Title],
      Author: [article.Author],
      Content: [article.Content],
      PublishedDate: [article.PublishedDate],
      Category: [article.Category],
      Tags: [article.Tags || []]
    });

  }

  toFormArray(articles: any[]): FormArray {

    const fb = new FormBuilder();

    const formGroups = articles.map(article => this.toForm(article));

    return fb.array(formGroups);

  }

  setArticles(formArray: FormArray) {

    localStorage.setItem('articles', JSON.stringify(formArray.getRawValue()));

    this.articlesSubject.next(formArray);

  }

  clearArticles() {

    const fb = new FormBuilder();

    localStorage.removeItem('articles');

    this.articlesSubject.next(fb.array([]));

  }

  getCurrentArticles(): FormArray | null {

    return this.articlesSubject.value;

  }

  getArticles(options: {
    category?: string;
    username?: string;
    hashtags?: string[];
    fromDate?: string;
    toDate?: string;
  }): Observable<Article[]> {
    
    const params: any = {};

    if (options.category !== undefined && options.category !== null) {
      params.category = options.category;
    }

    if (options.username) {
      params.username = options.username;
    }

    if (options.hashtags && options.hashtags.length > 0) {
      params.hashtags = options.hashtags.join(',');
    }

    if (options.fromDate) {
      params.from = options.fromDate;
    }

    if (options.toDate) {
      params.to = options.toDate;
    }

    return this.http.get<Article[]>(`${SERVER_URI}/articles`, { params });

  }

}

export enum EnumArticleCatagory {
  Any = 'Any',
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
