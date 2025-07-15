import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Model } from '../../shared/interfaces/model';
import environment from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private apiUrl = environment.API_URL;
  private httpClient = inject(HttpClient);

  getModels(): Observable<Model[]> {
    return this.httpClient.get<Model[]>(`${this.apiUrl}/api/models`);
  }

  getSingleModel(id: number): Observable<Model> {
    return this.httpClient.get<Model>(`${this.apiUrl}/api/models/${id}`);
  }
}
