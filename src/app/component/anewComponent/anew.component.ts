import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';

import { HeaderComponent } from '../headerComponent/header.component';
import { FooterComponent } from '../footerComponent/footer.component';

import { UserService } from '../../services/userService/user.service';
import { ImageService } from '../../services/imageService/image.service';
import { ArticleService, Article, EnumArticleCategory } from '../../services/articleService/article.service';

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

  currentUser: any = null;

  EnumArticleCategory = EnumArticleCategory;
  categoryOptions = Object.entries(EnumArticleCategory).map(([key, value]) => ({
    label: value, 
    value: key    
  }));
  selectedCategory: keyof typeof EnumArticleCategory = 'Unspecified';

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
    private router: Router,
    private userService: UserService,
    private imageService: ImageService,
    private articleService: ArticleService
  ) {
    
    this.form = userService.formBuilder();
  
  }

  ngOnInit(): void {

    this.userService.currentUser$.subscribe(userForm => {

      if (userForm) {

        this.form = userForm;

        this.currentUser = userForm.getRawValue();

      }

    });

  }    

  pictureFile: File | null = null;
  pictureURL = './RedDragonArticle.webp';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onFileSelectTriggered(): void {

    this.fileInput.nativeElement.click();

  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.pictureFile = input.files[0];

      const reader = new FileReader();

      reader.onload = () => {

        this.pictureURL = reader.result as string;

      };

      reader.readAsDataURL(this.pictureFile);

    }

  }

  onHashtagInput(event: Event): void {
    
    const input = (event.target as HTMLInputElement).value;
    
    const clean = input.replace(/[^a-zA-Z0-9 ]/g, '');

    let formatted = clean.startsWith('#') ? clean : '#' + clean;

    formatted = formatted
      .split(' ')
      .filter(seg => seg.length > 0)
      .map(seg => seg.startsWith('#') ? seg : '#' + seg)
      .join(' ');

    this.hashtagInput = formatted;

  }

  onHashtagKeyDown(event: KeyboardEvent): void {

    if (event.key === 'Backspace') {

      const val = this.hashtagInput;

      const cursor = (event.target as HTMLInputElement).selectionStart ?? val.length;

      if (cursor >= 2 && val[cursor - 2] === ' ' && val[cursor - 1] === '#') {

        event.preventDefault();

        this.hashtagInput = val.slice(0, cursor - 2) + val.slice(cursor);

      }

    }

  }

  parseHashtags(raw: string): string[] {

    if (!raw) return [];

    return raw
      .split(/[\s,]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 1 && tag.startsWith('#') && tag.length <= 30)
      .slice(0, 5);

  }

  articleTitle: string = '';

  today = new Date();

  hashtagInput: string = '';

  submitArticle(): void {

    if (!this.articleTitle || !this.richTextContent) {

      alert('Title and content are required.');

      return;

    }

    if (!this.currentUser?.ID) {
      
      alert('Cannot submit article: missing user ID.');
  
      return;

    }

    const articleData: any = {
      AuthorID: this.currentUser.ID,
      ArticleTitle: this.articleTitle,
      ArticleBody: this.richTextContent,
      ArticleCategory: this.selectedCategory as EnumArticleCategory,
      ArticleDate: this.today.toISOString().split('T')[0],
      ArticleHashtags: this.parseHashtags(this.hashtagInput)
    };

    console.log('Posting articleData:', articleData);

    const finalizeAndPost = (imageFilename: string | null) => {

      if (imageFilename) {

        articleData.ArticleImage = imageFilename;

      }

      this.articleService.postArticle(articleData).subscribe({
        next: () => {

          alert('Article uploaded!');

          this.router.navigate(['/aindex']);

        },
        error: err => {

          console.error('Upload error', err);
        
          if (err.error) {

            console.error('Backend error:', err.error);
          
            if (err.error.details) {

              console.error('Validation details:', err.error.details);
            
              alert(
                'Validation failed:\n' +
                Object.entries(err.error.details)
                  .map(([field, info]: any) => `${field}: ${info.message || JSON.stringify(info)}`)
                  .join('\n')
              );

            } else {

              alert('Upload failed: ' + (err.error.error || 'Unknown server error.'));

            }
          
          } else if (err.message) {

            alert('Upload failed: ' + err.message);

          } else {

            alert('Upload failed: Unknown error');

          }
          
        }
        
      });
      
    };

    if (this.pictureFile) {

      this.imageService.sendImageFileToServer(this.pictureFile).subscribe({

        next: (res: any) => {

          const imageFilename = res?.file?.filename;

          finalizeAndPost(imageFilename);

        },
        error: err => {

          console.error('Image upload error:', err);

          alert('Image upload failed.');

        }

      });

    } else {

      finalizeAndPost(null);

    }

  }

}