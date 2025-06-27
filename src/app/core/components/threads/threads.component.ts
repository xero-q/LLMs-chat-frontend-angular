import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ThreadService } from '../../services/thread.service';
import { StateService } from '../../services/state.service';

import { Thread } from '../../../shared/interfaces/thread';
import {
  PaginatedThreadsList,
  ThreadsList,
} from '../../../shared/interfaces/threads-list';
import { FriendlyDatePipe } from '../../../shared/pipes/friendly-date.pipe';

@Component({
  selector: 'app-threads',
  imports: [ReactiveFormsModule, CommonModule, FriendlyDatePipe],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
})
export class ThreadsComponent {
  private readonly threadService = inject(ThreadService);
  protected readonly stateService = inject(StateService);
  private readonly fb = inject(FormBuilder);

  private readonly page = signal(1);
  private readonly pageSize = 20;
  protected readonly hasNext = signal(false);

  protected readonly threadForm = signal(
    this.fb.group({
      threadTitle: ['', Validators.required],
    })
  );
  protected readonly threadFormVisible = signal(false);

  private readonly pages = signal(new Map<number, ThreadsList[]>());

  ngOnInit(): void {
    this.loadPage(1);
  }

  protected readonly threads = computed(() => {
    const allThreads = Array.from(this.pages().values())
      .flat()
      .flatMap((group) => group.threads);

    const grouped = new Map<string, Thread[]>();

    for (const thread of allThreads) {
      const dateKey = thread.createdAtDate.toString();

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(thread);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => b.localeCompare(a)) // Sort dates descending
      .map(([date, threads]) => ({
        date,
        threads,
      }));
  });

  loadPage(page: number) {
    this.threadService
      .getThreads(page, this.pageSize)
      .subscribe((data: PaginatedThreadsList) => {
        const pagesCopy = new Map(this.pages());
        pagesCopy.set(page, data.results);
        this.pages.set(pagesCopy);

        this.page.set(data.currentPage);
        this.hasNext.set(data.hasNext);
      });
  }

  reloadFirstPage() {
    this.loadPage(1);
  }

  onSubmit() {
    if (this.threadForm().valid) {
      this.threadService
        .startThread(
          this.stateService.selectedModel!.id,
          this.threadForm().get('threadTitle')?.value!
        )
        .subscribe({
          next: () => {
            this.threadForm().reset();
            this.reloadFirstPage(); // only reload page 1
          },
          error: (error: any) => {
            const messages = error.error.message ?? error.error.error;
            let messagesString = '';
            if (Array.isArray(messages)) {
              messagesString = messages.join('\n');
            } else {
              messagesString = messages;
            }
            alert(messagesString);
          },
        });
    }
  }

  onThreadSelect(thread: Thread) {
    this.stateService.setSelectedThread(thread);
  }

  loadMore() {
    this.loadPage(this.page() + 1);
  }

  removeThread(threadId: number) {
    const currentPages = this.pages();
    const updatedPages = new Map<number, ThreadsList[]>();

    for (const [pageNum, lists] of currentPages.entries()) {
      const newLists = lists
        .map((list) => ({
          ...list,
          threads: list.threads.filter((t) => t.id !== threadId),
        }))
        .filter((list) => list.threads.length > 0); // Remove empty groups

      if (newLists.length > 0) {
        updatedPages.set(pageNum, newLists);
      }
    }

    this.pages.set(updatedPages);
  }
}
