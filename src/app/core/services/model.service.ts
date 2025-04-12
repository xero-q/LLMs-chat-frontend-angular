import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Model } from '../../shared/interfaces/model';
import environment from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private apiUrl = environment.API_URL;

  constructor(private httpClient: HttpClient) {}

  getModels() {
    return this.httpClient.get<Model[]>(`${this.apiUrl}/api/models`);
  }

  getSingleModel(id: number) {
    return this.httpClient.get<Model>(`${this.apiUrl}/api/models/${id}`);
  }
}
