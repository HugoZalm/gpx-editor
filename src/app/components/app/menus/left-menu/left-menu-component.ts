import { Component, inject } from '@angular/core';
import { IconButtonComponent } from "../../buttons/icon-button/icon-button-component";
import { GpxStateService } from '../../../../services/gpx/state/gpx-state-service';
import { MapService } from '../../../../services/map/map.service';

@Component({
  selector: 'app-left-menu',
  imports: [IconButtonComponent],
  templateUrl: './left-menu-component.html',
  styleUrl: './left-menu-component.scss',
})
export class LeftMenuComponent {
  public gpxStateService = inject(GpxStateService);
  private mapService = inject(MapService);

  handleAction(action: string) {
    // alert(action + '-button clicked');
    switch (action) {
      case 'clear-selection':
        const id = this.gpxStateService.clearSelection();
        if (id) {
          this.mapService.toggleLayerSelection(id);
        }
        break;
    }
  }
}
