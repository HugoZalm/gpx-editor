import { Component, inject } from '@angular/core';
import { IconButtonComponent } from "../../buttons/icon-button/icon-button-component";
import { MapService } from '../../../../services/map/map.service';
import { MapStateService } from '../../../../services/map/map-state-service';
import { ProjectStateService } from '../../../../services/project/state/project-state-service';

@Component({
  selector: 'app-left-menu',
  imports: [IconButtonComponent],
  templateUrl: './left-menu-component.html',
  styleUrl: './left-menu-component.scss',
})
export class LeftMenuComponent {
  public projectStateService = inject(ProjectStateService);
  public mapStateService = inject(MapStateService);
  private mapService = inject(MapService);

  handleAction(action: string) {
    // alert(action + '-button clicked');
    switch (action) {
      case 'clear-selection':
        const id = this.projectStateService.clearSelection();
        if (id) {
          this.mapService.toggleLayerSelection(id);
        }
        break;
      case 'edit':
      case 'cut':
      case 'combine':
        this.mapService.setSelection(true);
        break;
      case 'close-selection':
        this.mapService.setSelection(false);
        break;
    }
  }
}
