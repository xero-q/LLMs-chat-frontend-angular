import { Injectable } from '@angular/core';
import { Model } from '../../shared/interfaces/model';
import { Thread } from '../../shared/interfaces/thread';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public selectedModel: Model | null = null;
  public selectedThread: Thread | null = null;

  setSelectedModel(model: Model) {
    this.selectedModel = model;
  }
  getSelectedModel() {
    return this.selectedModel;
  }
  clearSelectedModel() {
    this.selectedModel = null;
  }

  setSelectedThread(thread: Thread) {
    this.selectedThread = thread;
  }

  getSelectedThread() {
    return this.selectedThread;
  }

  clearSelectedThread() {
    this.selectedThread = null;
  }
}
