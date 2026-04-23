import { ProjectStateService } from './../../services/project/state/project-state-service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../components/app/map/map-component';
import { MapService } from '../../services/map/map.service';
import { TopMenuComponent } from "../../components/app/menus/top-menu/top-menu-component";
import { LeftMenuComponent } from "../../components/app/menus/left-menu/left-menu-component";
import { RightMenuComponent } from "../../components/app/menus/right-menu/right-menu-component";
import { BottomPanelComponent } from "../../components/app/panels/bottom-panel/bottom-panel-component";
import { RightPanelComponent } from '../../components/app/panels/right-panel/right-panel-component';
import { HttpClient } from '@angular/common/http';
import { UiStateService } from '../../services/ui/ui-state-service';

// export interface State {
//   showRightPanel: boolean;
//   showBottomPanel: boolean;
// }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    LeftMenuComponent,
    // RightMenuComponent,
    BottomPanelComponent,
    RightPanelComponent
],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private mapService = inject(MapService);
  public stateService = inject(UiStateService);
  public projectStateService = inject(ProjectStateService);
  private http = inject(HttpClient);

  ngOnInit() {
    this.mapService.setCenterFromLonLat(4.47917, 51.9225, 14);
  }

}
