import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ThreadService } from '../../services/thread.service';
import { Thread } from '../../../shared/interfaces/thread';
import { StateService } from '../../services/state.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-threads',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
})
export class ThreadsComponent {
  private threadService = inject(ThreadService);
  public stateService = inject(StateService);

  public threads: WritableSignal<Thread[]> = signal([]);

  threadForm!: FormGroup;
  threadFormVisible = false;

  constructor(private fb: FormBuilder) {
    this.doLoadThreads();
  }

  doLoadThreads() {
    this.threadService.getThreads().subscribe((data) => {
      this.threads.set(data);
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
            const messages = error.error.message;
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
}
