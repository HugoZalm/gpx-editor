import { Component, inject } from '@angular/core';
import { IconButtonComponent } from "../../buttons/icon-button/icon-button-component";
import { MapService } from '../../../../services/map/map.service';
import { MapStateService } from '../../../../services/map/state/map-state-service';
import { ProjectStateService } from '../../../../services/project/state/project-state-service';
import { HzxTrack } from '../../../../services/project/model/hzxProject';
import { CoreService } from '../../../../services/core-service';
import { UiStateService } from '../../../../services/ui/ui-state-service';
import { InteractionStates } from '../../../../services/map/model/interaction-states.enum';

@Component({
  selector: 'app-left-menu',
  imports: [IconButtonComponent],
  templateUrl: './left-menu-component.html',
  styleUrl: './left-menu-component.scss',
})
export class LeftMenuComponent {
  public coreService = inject(CoreService);
  public projectStateService = inject(ProjectStateService);
  public mapStateService = inject(MapStateService);


  handleAction(action: string) {
    // alert(action + '-button clicked');
    // let id;
    switch (action) {
      case 'select':
        this.coreService.setInteractionState(InteractionStates.SELECTION);
        break;
      case 'combine':
        this.coreService.setInteractionState(InteractionStates.COMBINER);
        // this.mapService.setSelection(true);
        break;
      case 'cut':
        this.coreService.setInteractionState(InteractionStates.SPLITTER);
        break;
      case 'close-selection':
        this.coreService.setInteractionState(InteractionStates.NONE);
        break;
      case 'close-splitter':
        this.coreService.setInteractionState(InteractionStates.NONE);
        break;
      case 'close-combine':
        this.coreService.setInteractionState(InteractionStates.NONE);
        // this.mapService.setSelection(false);
        break;
    }
  }
}
