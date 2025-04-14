import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ViewChild,
} from '@angular/core';
import { ThreadsComponent } from '../threads/threads.component';
import { StateService } from '../../services/state.service';
import { ModelsComponent } from '../models/models.component';
import { NgIf } from '@angular/common';
import { PromptsComponent } from '../prompts/prompts.component';

@Component({
  selector: 'app-home',
  imports: [ModelsComponent, ThreadsComponent, PromptsComponent, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  stateService = inject(StateService);

  @ViewChild(ThreadsComponent) threadsComponent!: ThreadsComponent;
  @ViewChild(PromptsComponent) promptsComponent!: PromptsComponent;

  constructor(private cdr: ChangeDetectorRef) {}

  onThreadDeleted() {
    if (this.threadsComponent) {
      this.threadsComponent.doLoadThreads();
      this.cdr.detectChanges();
    }
  }
}
