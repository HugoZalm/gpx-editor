import { CommonModule } from '@angular/common';
import { GpxStateService } from './../../../../services/gpx/state/gpx-state-service';
import { Component, computed, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MetaData, Route, Track, Waypoint } from '@we-gold/gpxjs';
import { HzxRoute, HzxTrack, HzxWaypoint } from '../../../../services/gpx/model/hzxProject';
import { MapService } from '../../../../services/map/map.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MenuButtonComponent } from '../../buttons/menu-button/menu-button-component';
import { MatDialog } from '@angular/material/dialog';
import { MetadataDialog } from '../../dialogs/metadata/metadata-dialog';

export interface FileItem {
  id: string;
  name: string;
  color: string;
  metadata: MetaData;
  tracks: TrackItem[];
  routes: RouteItem[];
  waypoints: WaypointItem[];
}

export interface TrackItem {
  id: string;
  name: string;
  color: string;
  track: HzxTrack;
}

export interface RouteItem {
  id: string;
  name: string;
  color: string;
  route: HzxRoute;
}

export interface WaypointItem {
  id: string;
  name: string;
  color: string;
  waypoint: HzxWaypoint;
}


@Component({
  selector: 'app-right-panel',
  imports: [CommonModule, MatListModule, MatButtonModule, MatMenuModule, MenuButtonComponent],
  templateUrl: './right-panel-component.html',
  styleUrl: './right-panel-component.scss',
})
export class RightPanelComponent {
  readonly dialog = inject(MatDialog);

  gpxState = inject(GpxStateService);
  mapService = inject(MapService);

  public projectMetadata = this.gpxState.projectMetaData;
  public projectFiles = computed(() => {
    const files = Array.from(this.gpxState.projectFiles().values()).map((gpx) => {
      return {
        id: gpx.metadata.id,
        name: gpx.raw.metadata.name,
        color: gpx.metadata.color,
        metadata: gpx.raw.metadata,
        tracks: this.getTracks(gpx.tracks),
        routes: this.getRoutes(gpx.routes),
        waypoints: this.getWaypoints(gpx.waypoints),
      } as FileItem;
    });
    console.log('FILES', files);
    return files;
  });

  changeProjectName() {
    this.gpxState.updateProjectName('TEST');
  }

  select(type: string, value: FileItem | TrackItem): void {
    const currentSelectedItemId = this.gpxState.getSelectedItem()?.id;
    if (currentSelectedItemId) {
      this.mapService.toggleLayerSelection(currentSelectedItemId);
    }
    this.gpxState.setSelectedItem(type, value.id);
    this.mapService.toggleLayerSelection(value.id);
  }

  isSelected(id: string): boolean {
    return this.gpxState.isSelected(id);
  }

  handleAction(action: string) {
    switch (action) {
      case 'edit-file':
      case 'edit-track':
        this.openMetadataDialog();
        break;
      case 'cut-track':
        break;
    }
  }

  private openMetadataDialog() {
    const item = this.gpxState.findSelectedItem();
    const type = this.gpxState.getSelectedItem()?.type;
    if (item) {
      const dialogRef = this.dialog.open(MetadataDialog, { data: item.metadata });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          console.log(result);
          item.metadata = result;
          if (type === 'track') {
            this.gpxState.updateItem(item as HzxTrack);
          }
        }
      });
    }
  }

  private getTracks(tracks: HzxTrack[]): TrackItem[] {
    const items = tracks.map((track) => {
      return {
        id: track.metadata.id,
        name: track.metadata.name,
        color: track.metadata.color,
        track: track,
      } as TrackItem;
    });
    return items;
  }

  private getRoutes(routes: HzxRoute[]): RouteItem[] {
    const items = routes.map((route) => {
      return {
        id: route.metadata.id,
        name: route.metadata.name,
        color: route.metadata.color,
        route: route,
      } as RouteItem;
    });
    return items;
  }

  private getWaypoints(waypoints: HzxWaypoint[]): WaypointItem[] {
    const items = waypoints.map((waypoint) => {
      return {
        id: waypoint.metadata.id,
        name: waypoint.metadata.name,
        color: waypoint.metadata.color,
        waypoint: waypoint,
      } as WaypointItem;
    });
    return items;
  }
}
