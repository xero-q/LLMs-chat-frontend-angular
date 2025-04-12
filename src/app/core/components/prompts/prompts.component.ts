import {
  Component,
  inject,
  Input,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../../shared/interfaces/prompt';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-prompts',
  imports: [CommonModule, ReactiveFormsModule, MarkdownModule],
  templateUrl: './prompts.component.html',
  styleUrl: './prompts.component.scss',
})
export class PromptsComponent {
  private promptsService = inject(PromptService);
  public stateService = inject(StateService);

  @Input() threadId!: number;
  promptForm!: FormGroup;

  public prompts: WritableSignal<Prompt[]> = signal([]);

  submitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.promptForm = this.fb.group({
      prompt: [''],
    });
  }

  doLoadPrompts() {
    this.promptsService.getPrompts(this.threadId).subscribe((data) => {
      this.prompts.set(data);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['threadId']) {
      this.doLoadPrompts();
    }
  }

  onSubmit() {
    if (this.promptForm.valid) {
      this.submitting = true;
      this.promptsService
        .addPrompt(this.threadId, this.promptForm.get('prompt')?.value)
        .subscribe({
          next: (response: Prompt) => {
            this.submitting = false;
            this.promptForm.reset();
            this.doLoadPrompts();
          },
          error: (error: any) => {
            this.submitting = false;
            const messages = error.error.message;
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
