import { PanelTypes, UiStateService } from './../../../../services/ui/ui-state-service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button-component';

@Component({
  selector: 'app-bottom-panel',
  imports: [
    CommonModule,
    IconButtonComponent,
  ],
  templateUrl: './bottom-panel-component.html',
  styleUrl: './bottom-panel-component.scss',
})
export class BottomPanelComponent {
  public uiStateService = inject(UiStateService);

    handleAction(action: string) {
      switch (action) {
        case 'toggle-panel':
          this.uiStateService.togglePanel(PanelTypes.BOTTOM);
          break;
      }
    }
}
