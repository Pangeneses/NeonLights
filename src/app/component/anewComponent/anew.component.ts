import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';

import { HeaderComponent } from '../headerComponent/header.component';
import { FooterComponent } from '../footerComponent/footer.component';

import { UserService } from '../../services/userService/user.service';
import { ArticleService, Article, EnumArticleCatagory } from '../../services/articleService/article.service';

import Quill from 'quill';

const Block: any = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block, true);

@Component({
  selector: 'anew-component-anew',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule],
  templateUrl: './anew.component.html',
  styleUrl: './anew.component.scss'
})
export class ANewComponent implements OnInit {

  form: FormGroup;

  today = new Date();

  EnumArticleCatagory = EnumArticleCatagory;
  categoryOptions = Object.values(EnumArticleCatagory).map(value => ({
    label: value,
    value: value
  }));
  selectedCategory: EnumArticleCatagory = EnumArticleCatagory.Any;

  richTextContent: string = '';
  quillModules = {
    toolbar: [      
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],        
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      
    [{ 'indent': '-1'}, { 'indent': '+1' }],     
    [{ 'align': [] }],                      
    [{ 'size': ['small', false, 'large', 'huge'] }],  
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],         
    ['link', 'image', 'video']                                
    ]
  };

  constructor(
    private userService: UserService,
    private articleService: ArticleService
  ) {
    
    this.form = userService.formBuilder();
  
  }

  ngOnInit(): void {

    this.userService.currentUser$.subscribe(importForm => {
      
      if (importForm) {
        
        this.form.patchValue(importForm.value);
        
      }

    });

  }    

}