import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from '../headerComponent/header.component';
import { FNavComponent } from '../fnavComponent/fnav.component';
import { FooterComponent } from '../footerComponent/footer.component';

import { ThreadService, Thread, EnumForumCategory } from '../../services/threadService/thread.service';

import { environment } from '../../../environments/environment';

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
    MatIconModule],
  templateUrl: './findex.component.html',
  styleUrl: './findex.component.scss',
})
export class FIndexComponent implements OnInit {

  IMAGE_REPO = environment.IMAGE_REPO;

  threadChunk: Thread[] = [];

  isLoading = false;

  hasMore = true;

  limit = 10;

  readonly lastCursor = computed(() => {

    const threads = this.threadChunk;

    return threads.length > 0 ? ((threads.at(-1) as any)?._id ?? '') : '';

  });

  readonly firstCursor = computed(() => {

    const threads = this.threadChunk;

    return threads.length > 0 ? ((threads.at(0) as any)?._id ?? '') : '';

  });

  threadTrackFN(index: number, thread: Thread): string {

    return thread.ThreadID;

  }

  CleanNBSP(text: string): string {

    return text?.replace(/\u00A0/g, ' ') ?? '';

  }

  constructor(
    private router: Router,
    private threadService: ThreadService,
  ) { }

  ngOnInit(): void {

  }

  onFiltersChanged(filters: {
    ThreadUserID?: string;
    ThreadCategory?: EnumForumCategory;
    ThreadHashtags?: string[];
    ThreadFrom?: string;
    ThreadTo?: string;
  }): void {

    this.hasMore = true;

    this.threadService.clearThreads();

    this.threadService
      .fetchThreadChunk({
        limit: this.limit,
        lastID: undefined,
        ...filters,
      })
      .subscribe({
        next: (hasMore) => {

          this.hasMore = hasMore;

          const threads = this.threadService.getCurrentThreads();

          this.threadChunk = threads || [];

        },
        error: (err) => {

          console.error('Failed to fetch threads with filters:', err);

          this.threadChunk = [];

          this.hasMore = false;

        },

      }

      );

  }

  loadOlder(): void {

    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    this.threadService
      .fetchThreadChunk({
        limit: this.limit,
        lastID: this.lastCursor(),
        direction: 'down',
      })
      .subscribe({
        next: (hasMore) => {

          this.hasMore = hasMore;

          this.isLoading = false;

        },
        error: (err) => {

          console.error('Error fetching older threads:', err);

          this.isLoading = false;

        },

      }

      );

  }

  loadNewer(): void {

    if (this.isLoading) return;

    this.isLoading = true;

    this.threadService
      .fetchThreadChunk({
        limit: this.limit,
        lastID: this.firstCursor(),
        direction: 'up',
      })
      .subscribe({
        next: (hasMore) => {

          this.isLoading = hasMore;

          this.isLoading = false;

        },
        error: (err) => {

          console.error('Error fetching newer threads:', err);

          this.isLoading = false;

        },

      }

      );

  }

  loadMore(): void {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    this.threadService
      .fetchThreadChunk({
        limit: this.limit,
        lastID: this.lastCursor(),
      })
      .subscribe({
        next: (hasMore) => {

          this.hasMore = hasMore;

          this.isLoading = false;

        },
        error: (err) => {

          console.error('Failed to fetch more threads:', err);

          this.isLoading = false;

        },

      }

      );

  }

  readThread(threadID: string) {

    const thread = this.threadChunk.find(t => t.ThreadID === threadID);

    if (thread) {

      this.router.navigate(['/freader'], { state: { thread } });

    } else {

      console.warn(`Thread with ID ${threadID} not found.`);

    }

  }

}  
