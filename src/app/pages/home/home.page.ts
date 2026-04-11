import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../components/app/map/map-component';
import { MapService } from '../../components/app/map/map.service';
import { TopMenuComponent } from "../../components/app/menus/top-menu/top-menu-component";
import { LeftMenuComponent } from "../../components/app/menus/left-menu/left-menu-component";
import { RightMenuComponent } from "../../components/app/menus/right-menu/right-menu-component";
import { BottomPanelComponent } from "../../components/app/panels/bottom-panel/bottom-panel-component";

export interface Panels { settings: boolean; box: boolean }


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    TopMenuComponent,
    LeftMenuComponent,
    RightMenuComponent,
    BottomPanelComponent
],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private mapService = inject(MapService);

  ngOnInit() {
    this.mapService.setCenterFromLonLat(4.47917, 51.9225, 14);
  }

}
