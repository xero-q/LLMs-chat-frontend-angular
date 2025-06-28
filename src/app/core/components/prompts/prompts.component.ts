import {
  Component,
  inject,
  input,
  output,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from 'ngx-markdown';

import { PromptService } from '../../services/prompt.service';
import { StateService } from '../../services/state.service';
import { ThreadService } from '../../services/thread.service';

import { Prompt } from '../../../shared/interfaces/prompt';
import { FriendlyDatePipe } from '../../../shared/pipes/friendly-date.pipe';

@Component({
  selector: 'app-prompts',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MarkdownModule,
    FriendlyDatePipe,
  ],
  templateUrl: './prompts.component.html',
  styleUrl: './prompts.component.scss',
})
export class PromptsComponent {
  private readonly promptsService = inject(PromptService);
  private readonly threadsService = inject(ThreadService);
  protected readonly stateService = inject(StateService);

  private readonly fb = inject(FormBuilder);

  public readonly threadId = input.required<number>();
  public readonly threadDeleted = output<number>();

  protected readonly promptForm = signal(
    this.fb.group({
      prompt: ['', Validators.required],
    })
  );

  protected prompts: WritableSignal<Prompt[]> = signal([]);

  protected readonly isSubmitting = signal(false);

  doLoadPrompts() {
    this.promptsService.getPrompts(this.threadId()).subscribe((data) => {
      this.prompts.set(data);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['threadId']) {
      this.doLoadPrompts();
    }
  }

  onSubmit() {
    if (this.promptForm().valid) {
      this.isSubmitting.set(true);
      this.promptsService
        .addPrompt(this.threadId(), this.promptForm().get('prompt')?.value!)
        .subscribe({
          next: (response: Prompt) => {
            this.isSubmitting.set(false);
            this.promptForm().reset();
            this.doLoadPrompts();
          },
          error: (error: any) => {
            this.isSubmitting.set(false);
            const messages = error.error.message ?? error.error.detail;
            let messagesString = '';
            if (Array.isArray(messages)) {
              messagesString = messages.join(', ');
            } else {
              messagesString = messages;
            }
            alert(messagesString);
          },
        });
    }
  }

  onDeleteThread(threadId: number) {
    if (confirm('Are you sure?')) {
      this.threadsService.deleteThread(threadId).subscribe({
        next: () => {
          this.threadDeleted.emit(threadId);
          this.stateService.clearSelectedThread();
        },
        error: (error: any) => {
          this.isSubmitting.set(false);
          const messages = error.error.message ?? error.error.error;
          let messagesString = '';
          if (Array.isArray(messages)) {
            messagesString = messages.join(', ');
          } else {
            messagesString = messages;
          }
          alert(messagesString);
        },
      });
    }
  }
}
