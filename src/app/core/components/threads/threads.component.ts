import { Component, inject, signal, computed } from '@angular/core';
import { ThreadService } from '../../services/thread.service';
import { Thread } from '../../../shared/interfaces/thread';
import { StateService } from '../../services/state.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  PaginatedThreadsList,
  ThreadsList,
} from '../../../shared/interfaces/threads-list';
import { FriendlyDatePipe } from '../../../shared/pipes/friendly-date.pipe';

@Component({
  selector: 'app-threads',
  imports: [ReactiveFormsModule, NgIf, NgFor, CommonModule, FriendlyDatePipe],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
})
export class ThreadsComponent {
  private threadService = inject(ThreadService);
  public stateService = inject(StateService);

  private pages = signal(new Map<number, ThreadsList[]>());
  public threads = computed(() =>
    Array.from(this.pages().entries())
      .sort(([a], [b]) => a - b)
      .flatMap(([, threads]) => threads)
  );

  page = 1;
  pageSize = 20;
  hasNext = false;

  threadForm!: FormGroup;
  threadFormVisible = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.threadForm = this.fb.group({
      thread_title: ['', Validators.required],
    });
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.threadService
      .getThreads(page, this.pageSize)
      .subscribe((data: PaginatedThreadsList) => {
        const pagesCopy = new Map(this.pages());
        pagesCopy.set(page, data.results);
        this.pages.set(pagesCopy);

        this.page = data.current_page;
        this.hasNext = data.has_next;
      });
  }

  reloadFirstPage() {
    this.loadPage(1);
  }

  onSubmit() {
    if (this.threadForm.valid) {
      this.threadService
        .startThread(
          this.stateService.selectedModel!.id,
          this.threadForm.get('thread_title')?.value
        )
        .subscribe({
          next: () => {
            this.threadForm.reset();
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
    this.loadPage(this.page + 1);
  }
}
