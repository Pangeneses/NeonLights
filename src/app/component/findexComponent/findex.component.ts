import { Component, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from '../headerComponent/header.component';
import { FNavComponent } from '../fnavComponent/fnav.component';
import { FooterComponent } from '../footerComponent/footer.component';

import { ThreadService, Thread, ThreadWithUserName, EnumForumCategory } from '../../services/threadService/thread.service'; 

import { SERVER_URI } from '../../../../environment'

@Component({
  selector: 'thread-component-findex',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FNavComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './findex.component.html',
  styleUrl: './findex.component.scss'
})
export class FIndexComponent {

  SERVER_URI = SERVER_URI;

  readonly allThreads = signal<ThreadWithUserName[]>([]);
  
  readonly isLoading = signal(false);
  readonly hasMore = signal(true);

  readonly limit = 10;
  readonly lastCursor = computed(() => {

    const threads = this.allThreads();

    return threads.length > 0 ? (threads.at(-1) as any)?._id ?? '' : '';

  });

  threadTrackFn(index: number, thread: Thread): string {

    return (thread as any)?._id ?? thread.ThreadTitle;

  }

  constructor(
    private router: Router,
    private threadService: ThreadService) {
    
    this.threadService.threads$.subscribe(formArray => {
    
      if (formArray instanceof FormArray) {
      
        const rawThreads = formArray.getRawValue();
      
        const populated = rawThreads.map((a: Thread) => ({
          ...a,
          AuthorName: typeof a.AuthorID === 'object' ? a.AuthorID.UserName : 'Unknown Author'
        }));
      
        this.allThreads.set(populated);
      
      } else {
        this.allThreads.set([]);
      }
    
    });
  
  }

  onFiltersChanged(filters: {    
    AuthorID?: string;
    ThreadCategory?: EnumForumCategory;
    ThreadHashtags?: string[];
    fromDate?: string;
    toDate?: string;
  }): void {

    this.hasMore.set(true);

    this.threadService.clearThreads();

    this.threadService.fetchThreadChunk({
      limit: this.limit,
      lastId: undefined,
      ...filters
    }).subscribe(hasMore => {

      this.hasMore.set(hasMore);

    });

  }

  loadMore(): void {

    if (this.isLoading() || !this.hasMore()) return;

    this.isLoading.set(true);

    this.threadService.fetchThreadChunk({
      limit: this.limit,
      lastId: this.lastCursor()
    }).subscribe({
      next: hasMore => {

        this.hasMore.set(hasMore);

        this.isLoading.set(false);        

      },
      error: err => {

        console.error('Failed to fetch more threads:', err);

        this.isLoading.set(false);

      }

    });

  }

  readThread(threadID: string){

    this.router.navigate(['/areader'], { queryParams: { id: threadID } });

  }

}
