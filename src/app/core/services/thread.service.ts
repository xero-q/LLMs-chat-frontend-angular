import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Thread } from '../../shared/interfaces/thread';
import { ThreadsList } from '../../shared/interfaces/threads-list';
import { Observable } from 'rxjs';
import environment from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private apiUrl = environment.API_URL;

  constructor(private httpClient: HttpClient) {}

  getThreads(): Observable<ThreadsList[]> {
    return this.httpClient.get<ThreadsList[]>(`${this.apiUrl}/api/threads`);
  }

  startThread(model_id: number, thread_title: string): Observable<Thread> {
    return this.httpClient.post<Thread>(
      `${this.apiUrl}/api/threads/${model_id}/start`,
      {
        title: thread_title,
      }
    );
  }

  deleteThread(threadId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.apiUrl}/api/threads/${threadId}`
    );
  }
}
