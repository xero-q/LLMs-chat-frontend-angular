import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Model } from '../../../shared/interfaces/model';
import { ModelService } from '../../services/model.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-models',
  imports: [],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss',
})
export class ModelsComponent {
  private modelsService = inject(ModelService);
  private stateService = inject(StateService);

  public models: WritableSignal<Model[]> = signal([]);

  constructor() {
    this.modelsService.getModels().subscribe((data) => {
      this.models.set(data);
    });
  }

  onModelChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value
      ? parseInt(selectElement.value)
      : null;

    if (selectedValue) {
      this.modelsService
        .getSingleModel(selectedValue)
        .subscribe((model: Model) => {
          this.stateService.setSelectedModel(model);
        });
    } else {
      this.stateService.clearSelectedModel();
    }
  }
}
