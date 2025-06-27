import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { StateService } from '../../services/state.service';

import { ThreadsComponent } from '../threads/threads.component';
import { ModelsComponent } from '../models/models.component';
import { PromptsComponent } from '../prompts/prompts.component';

@Component({
  selector: 'app-home',
  imports: [ModelsComponent, ThreadsComponent, PromptsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected readonly stateService = inject(StateService);
  private readonly authService = inject(AuthService);

  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(ThreadsComponent) threadsComponent!: ThreadsComponent;
  @ViewChild(PromptsComponent) promptsComponent!: PromptsComponent;

  protected readonly menuOpen = signal(false);

  onThreadDeleted(threadId: number) {
    if (this.threadsComponent) {
      this.threadsComponent.removeThread(threadId);
      this.cdr.detectChanges();
    }
  }

  toggleMenu() {
    this.menuOpen.update((value) => !value);
  }

  logout() {
    this.authService.logout();
  }
}
