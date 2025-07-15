import { inject, Injectable } from '@angular/core';
import environment from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prompt } from '../../shared/interfaces/prompt';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private apiUrl = environment.API_URL;
  private httpClient = inject(HttpClient);

  getPrompts(threadId: number): Observable<Prompt[]> {
    return this.httpClient.get<Prompt[]>(
      `${this.apiUrl}/api/threads/${threadId}/prompts`
    );
  }

  addPrompt(threadId: number, prompt: string): Observable<Prompt> {
    return this.httpClient.post<Prompt>(
      `${this.apiUrl}/api/threads/${threadId}/prompts`,
      {
        prompt,
      }
    );
  }
}
