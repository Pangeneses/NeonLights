import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { HeaderComponent } from '../headerComponent/header.component';
import { FooterComponent } from '../footerComponent/footer.component';
import { ReplyComponent } from '../replyComponent/reply.component';

import { Thread, ThreadService, EnumForumCategory } from '../../services/threadService/thread.service';
import { PostService, Post } from '../../services/postService/post.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'forum-component-freader',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReplyComponent,
    RouterLink,
    RouterLinkActive,
    MatIcon
  ],
  templateUrl: './freader.component.html',
  styleUrls: ['./freader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FReaderComponent implements OnInit {

  SERVER_URI = environment.SERVER_URI;

  thread: Thread = {
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

  posts: Post[] = [];

  postTrackFN(index: number, post: Post): string {

    console.log(post.PostID);

    return post.PostID;

  }

  CleanNBSP(text: string): string {

    return text?.replace(/\u00A0/g, ' ') ?? '';

  }

  constructor(
    private threadService: ThreadService,
    private postService: PostService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    const navigation = this.router.getCurrentNavigation();

    const state = navigation?.extras?.state;

    if (state?.['thread']) {

      this.thread = state['thread'] as Thread;

    } else {

      console.error('No thread in router state');

      this.router.navigate(['/']); // or your fallback route

    }

  }

  ngOnInit(): void {

    if (!this.thread) return;

    this.fetchPosts();

  }

  fetchPosts() {

    const postIDs = this.thread.ThreadPosts;

    console.log(postIDs);

    this.postService.fetchPosts(postIDs).subscribe({
      next: () => {

        const posts = this.postService.getCurrentPosts();

        console.log(posts);

        if (posts) {

          this.posts.length = 0;

          this.posts = [...posts];

          this.cdr.markForCheck();

        }

      },
      error: (err) => {

        console.error('Failed to fetch posts', err);

      }

    });

  }

  newReply = false;

  takeNewReply(): void {

    this.newReply = true;

  }

  onNewReply(): void {

    this.newReply = false;

    this.threadService.getThreadByID(this.thread.ThreadID).subscribe({
      next: (updatedThread) => {

        this.thread = updatedThread;

        this.fetchPosts();

      },
      error: (err) => {

        console.error('Failed to fetch thread by ID:', err);

      },

    });

  }

}
