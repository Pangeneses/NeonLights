import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';

import { UserService } from '../../services/userService/user.service';
import { EnumForumCategory, Thread } from '../../services/threadService/thread.service';
import { PostService } from '../../services/postService/post.service';

import { environment } from '../../../environments/environment';

import Quill from 'quill';
const Delta = Quill.import('delta');

const Block: any = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block, true);

@Component({
  selector: 'forum-component-reply',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    QuillModule,
  ],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.scss',
})
export class ReplyComponent implements OnInit, AfterViewInit {

  @Input() CurrentThread: Thread = {
    ThreadID: '',
    ThreadUserID: '',
    ThreadUserName: '',
    ThreadUserAvatar: '',
    ThreadTitle: '',
    ThreadBody: '',
    ThreadPosts: [],
    ThreadDate: '',
    ThreadAccess: '',
    ThreadCategory: EnumForumCategory.Unspecified,
    ThreadHashtags: []
  };

  IMAGE_REPO = environment.IMAGE_REPO;

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
    private userService: UserService,
    private postService: PostService
  ) {

  }

  CurrentUser: any = null;

  ngOnInit(): void {

    this.userService.currentUser$.subscribe((userForm) => {

      if (userForm) {

        this.CurrentUser = userForm.getRawValue();

        if (!this.CurrentUser?.ID) {

          console.log(this.CurrentUser);

          this.closeReply.emit();

          return;

        }

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

      event.clipboardData.clearData();

    });

  }

  today = new Date();

  @Output() closeReply = new EventEmitter<void>();

  onSubmitReply(): void {

    if (!this.CurrentUser?.ID) {

      alert('Cannot submit reply: missing user ID.');

      this.closeReply.emit();

      return;

    }

    const replyData: any = {
      PostUserID: this.CurrentUser.ID,
      PostThreadID: this.CurrentThread.ThreadID,
      PostBody: this.richTextContent,
      PostDate: this.today.toISOString()
    };

    this.postService.newReply(replyData).subscribe({
      next: () => {

        this.closeReply.emit();

        this.richTextContent = '';

      },
      error: (err) => {

        console.error('Upload error', err);

        this.closeReply.emit();

      }

    });

  }

  onDeleteReply(): void {

    this.closeReply.emit();

  }

}
