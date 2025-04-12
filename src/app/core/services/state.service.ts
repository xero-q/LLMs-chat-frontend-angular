import { Injectable } from '@angular/core';
import { Model } from '../../shared/interfaces/model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public selectedModel: Model | null = null;

  constructor() {}

  setSelectedModel(model: Model) {
    this.selectedModel = model;
  }
  getSelectedModel() {
    return this.selectedModel;
  }
  clearSelectedModel() {
    this.selectedModel = null;
  }
}
