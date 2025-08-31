import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';

import { HeaderComponent } from '../headerComponent/header.component';
import { FooterComponent } from '../footerComponent/footer.component';

import { UserService } from '../../services/userService/user.service';
import { ImageService } from '../../services/imageService/image.service';
import { ArticleService, EnumArticleCategory } from '../../services/articleService/article.service';

import { environment } from '../../../environments/environment';

import Quill from 'quill';
const Delta = Quill.import('delta');

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
    FormsModule,
    QuillModule,
  ],
  templateUrl: './anew.component.html',
  styleUrl: './anew.component.scss',
})
export class ANewComponent implements OnInit, AfterViewInit {

  SERVER_URI = environment.SERVER_URI;

  CurrentUser: any = null;

  richTextContent: string = '';

  quillModules = {
    toolbar: [
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image', 'video'],
    ],
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private imageService: ImageService,
    private articleService: ArticleService,
  ) {

  }

  ngOnInit(): void {

    this.userService.currentUser$.subscribe((userForm) => {

      if (userForm) {

        this.CurrentUser = userForm.getRawValue();

      }

    });

  }

  @ViewChild('quillEditor', { static: true }) quillEditorComponent!: { quillEditor: Quill };

  ngAfterViewInit() {

    const quillInstance = this.quillEditorComponent.quillEditor;

    quillInstance.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {

      return new Delta();

    });

    quillInstance.root.addEventListener('paste', (event: ClipboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const clipboardData = event.clipboardData;

      if (!clipboardData) return;

      const text = clipboardData.getData('text/plain');

      const withSpaces = text.replace(/ {2,}/g, (match) =>
        ' ' + '&nbsp;'.repeat(match.length - 1)
      );

      const html = withSpaces
        .split(/\r?\n/)
        .map(line => `<div>${line || '<br>'}</div>`)
        .join('');

      const range = quillInstance.getSelection(true);

      quillInstance.clipboard.dangerouslyPasteHTML(range?.index ?? 0, html);

      quillInstance.setSelection((range?.index ?? 0) + html.length, 0);

    });

  }

  pictureFile: File | null = null;
  pictureURL = './d741b779-9c57-472a-a983-5c1dcaef7426.webp';

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

  EnumArticleCategory = EnumArticleCategory;
  categoryOptions = Object.entries(EnumArticleCategory).map(([key, value]) => ({
    label: value,
    value: key,
  }));
  selectedCategory: keyof typeof EnumArticleCategory = 'Unspecified';

  hashtagInput: string = '';

  onHashtagInput(event: Event): void {

    const input = (event.target as HTMLInputElement).value;

    const clean = input.replace(/[^a-zA-Z0-9 ]/g, '');

    let formatted = clean.startsWith('#') ? clean : '#' + clean;

    formatted = formatted
      .split(' ')
      .filter((seg) => seg.length > 0)
      .map((seg) => (seg.startsWith('#') ? seg : '#' + seg))
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
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 1 && tag.startsWith('#') && tag.length <= 30)
      .slice(0, 5);

  }

  articleTitle: string = '';

  today = new Date();

  submitArticle(): void {

    if (!this.articleTitle || !this.richTextContent) {

      alert('Title and content are required.');

      return;

    }

    if (!this.CurrentUser?.ID) {

      alert('Cannot submit article: missing user ID.');

      return;

    }

    const articleData: any = {
      ArticleUserID: this.CurrentUser.ID,
      ArticleTitle: this.articleTitle,
      ArticleBody: this.richTextContent,
      ArticleCategory: this.selectedCategory as EnumArticleCategory,
      ArticleDate: this.today.toISOString(),
      ArticleHashtags: this.parseHashtags(this.hashtagInput),
    };

    const finalizeAndPost = (imageFilename: string | null) => {

      if (imageFilename) {

        articleData.ArticleImage = imageFilename;

      }

      this.articleService.postArticle(articleData).subscribe({
        next: () => {

          alert('Article uploaded!');

          this.router.navigate(['/aindex']);

        },
        error: (err) => {

          console.error('Upload error', err);

          if (err.error) {

            console.error('Backend error:', err.error);

            if (err.error.details) {

              console.error('Validation details:', err.error.details);

              alert(
                'Validation failed:\n' +
                Object.entries(err.error.details)
                  .map(([field, info]: any) => `${field}: ${info.message || JSON.stringify(info)}`)
                  .join('\n'),
              );
            } else {

              alert('Upload failed: ' + (err.error.error || 'Unknown server error.'));

            }
          } else if (err.message) {

            alert('Upload failed: ' + err.message);

          } else {

            alert('Upload failed: Unknown error');

          }

        },

      });

    };

    if (this.pictureFile) {

      this.imageService.sendImageFileToServer(this.pictureFile).subscribe({
        next: (res: any) => {

          const imageFilename = res?.file?.filename;

          finalizeAndPost(imageFilename);

        },
        error: (err) => {

          console.error('Image upload error:', err);

          alert('Image upload failed.');

        },
      });
    } else {

      finalizeAndPost(null);

    }

  }

}
