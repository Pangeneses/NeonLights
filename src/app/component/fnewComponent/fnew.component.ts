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
import { ThreadService, Thread, EnumForumCategory } from '../../services/threadService/thread.service';

import Quill from 'quill';

const Block: any = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block, true);

@Component({
  selector: 'fnew-component-fnew',
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
  templateUrl: './fnew.component.html',
  styleUrl: './fnew.component.scss'
})
export class FNewComponent implements OnInit {

  form: FormGroup;

  currentUser: any = null;

  EnumForumCategory = EnumForumCategory;
  categoryOptions = Object.entries(EnumForumCategory).map(([key, value]) => ({
    label: value, 
    value: key    
  }));
  selectedCategory: keyof typeof EnumForumCategory = 'Unspecified';

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
    private threadService: ThreadService
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
  pictureURL = './RedDragonThread.webp';

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

  threadTitle: string = '';

  today = new Date();

  hashtagInput: string = '';

  submitThread(): void {

    if (!this.threadTitle || !this.richTextContent) {

      alert('Title and content are required.');

      return;

    }

    if (!this.currentUser?.ID) {
      
      alert('Cannot submit thread: missing user ID.');
  
      return;

    }

    const threadData: any = {
      AuthorID: this.currentUser.ID,
      ThreadTitle: this.threadTitle,
      ThreadBody: this.richTextContent,
      ThreadCategory: this.selectedCategory as EnumForumCategory,
      ThreadDate: this.today.toISOString().split('T')[0],
      ThreadHashtags: this.parseHashtags(this.hashtagInput)
    };

    console.log('Posting threadData:', threadData);

    const finalizeAndPost = (imageFilename: string | null) => {

      if (imageFilename) {

        threadData.ThreadImage = imageFilename;

      }

      this.threadService.postThread(threadData).subscribe({
        next: () => {

          alert('Thread uploaded!');

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