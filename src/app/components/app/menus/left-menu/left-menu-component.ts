import { Component, inject } from '@angular/core';
import { IconButtonComponent } from "../../buttons/icon-button/icon-button-component";
import { MapService } from '../../../../services/map/map.service';
import { MapStateService } from '../../../../services/map/state/map-state-service';
import { ProjectStateService } from '../../../../services/project/state/project-state-service';
import { HzxTrack } from '../../../../services/project/model/hzxProject';
import { CoreService } from '../../../../services/core-service';

@Component({
  selector: 'app-left-menu',
  imports: [IconButtonComponent],
  templateUrl: './left-menu-component.html',
  styleUrl: './left-menu-component.scss',
})
export class LeftMenuComponent {
  public coreService = inject(CoreService);

  handleAction(action: string) {
    // alert(action + '-button clicked');
    let id;
    switch (action) {
      case 'clear-selection':
          // id = this.coreService.setSelection(undefined);
        if (id) {
          // this.coreService.setSelection(id);
        }
        break;
      case 'edit':
      case 'combine':
        // this.mapService.setSelection(true);
        break;
      case 'cut':
        // id = this.coreService.getSelectedItem();
        if(id) {
          // this.mapService.setSplitter(id);
        }
        break;
      case 'close-selection':
        // this.mapService.setSelection(false);
        break;
    }
  }
}
