import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Thread } from '../../shared/interfaces/thread';
import { PaginatedThreadsList } from '../../shared/interfaces/threads-list';
import { Observable } from 'rxjs';
import environment from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private apiUrl = environment.API_URL;

  constructor(private httpClient: HttpClient) {}

  getThreads(
    page: number,
    pageSize: number = 20
  ): Observable<PaginatedThreadsList> {
    return this.httpClient.get<PaginatedThreadsList>(
      `${this.apiUrl}/api/threads?page=${page}&pageSize=${pageSize}`
    );
  }

  startThread(model_id: number, thread_title: string): Observable<Thread> {
    return this.httpClient.post<Thread>(
      `${this.apiUrl}/api/models/${model_id}/threads`,
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
