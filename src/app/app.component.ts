import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ModelsComponent } from './core/components/models/models.component';
import { StateService } from './core/services/state.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ModelsComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Ollama API Chatbot';

  stateService = inject(StateService);
}
