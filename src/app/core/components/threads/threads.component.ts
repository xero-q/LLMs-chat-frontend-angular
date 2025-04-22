import {
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
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

  page = 1;
  pageSize = 20;
  hasNext = false;

  public threads: WritableSignal<ThreadsList[]> = signal([]);

  threadForm!: FormGroup;
  threadFormVisible = false;

  constructor(private fb: FormBuilder) {
    this.doLoadThreads(1);
  }

  doLoadThreads(page: number = 1) {
    this.threadService
      .getThreads(page, this.pageSize)
      .subscribe((data: PaginatedThreadsList) => {
        this.threads.set([...this.threads(), ...data.results]);
        this.page = data.current_page;
        this.hasNext = data.has_next;
      });
  }

  ngOnInit(): void {
    this.threadForm = this.fb.group({
      thread_title: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.threadForm.valid) {
      this.threadService
        .startThread(
          this.stateService.selectedModel!.id,
          this.threadForm.get('thread_title')?.value
        )
        .subscribe({
          next: (response: Thread) => {
            this.threadForm.reset();
            this.doLoadThreads();
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
    this.doLoadThreads(this.page + 1);
  }
}
