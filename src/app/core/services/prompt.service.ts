import { Injectable } from '@angular/core';
import environment from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prompt } from '../../shared/interfaces/prompt';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private apiUrl = environment.API_URL;

  constructor(private httpClient: HttpClient) {}

  getPrompts(thread_id: number): Observable<Prompt[]> {
    return this.httpClient.get<Prompt[]>(
      `${this.apiUrl}/api/threads/${thread_id}/prompts`
    );
  }

  addPrompt(thread_id: number, prompt: string): Observable<Prompt> {
    return this.httpClient.post<Prompt>(
      `${this.apiUrl}/api/threads/${thread_id}/prompts`,
      {
        user_prompt: prompt,
      }
    );
  }
}
