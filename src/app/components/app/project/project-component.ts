import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MenuButtonComponent } from '../buttons/menu-button/menu-button-component';
import { GpxUtilsService } from '../../../services/gpx/utils/gpx-utils-service';
import { MapService } from '../../../services/map/map.service';
import { HzxTrack, HzxRoute, HzxWaypoint } from '../../../services/project/model/hzxProject';
import { ProjectService } from '../../../services/project/project-service';
import { ProjectStateService } from '../../../services/project/state/project-state-service';
import { PanelTypes, UiStateService } from '../../../services/ui/ui-state-service';
import { ImportDialog } from '../dialogs/import/import-dialog';
import { MetadataDialog, MetadataDialogData } from '../dialogs/metadata/metadata-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MetaData } from '@we-gold/gpxjs';
import { TranslatePipe } from '@ngx-translate/core';

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
  selector: 'app-project-component',
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MenuButtonComponent,
    TranslatePipe
  ],
  templateUrl: './project-component.html',
  styleUrl: './project-component.scss',
})
export class ProjectComponent {
  readonly dialog = inject(MatDialog);

  public uiStateService = inject(UiStateService);
  private projectStateService = inject(ProjectStateService);
  private projectService = inject(ProjectService);
  private gpxUtilsService = inject(GpxUtilsService);
  private mapService = inject(MapService);

  public projectMetadata = this.projectStateService.projectMetaData;
  public projectFiles = computed(() => {
    const files = Array.from(this.projectStateService.projectFiles().values()).map((gpx) => {
      return {
        id: gpx.metadata.id,
        name: gpx.raw.metadata.name,
        color: gpx.metadata.color,
        metadata: gpx.raw.metadata,
        tracks: this.getTracks(gpx.tracks),
        routes: this.getRoutes(gpx.routes),
        waypoints: this.getWaypoints(gpx.waypoints) ?? [],
      } as FileItem;
    });
    console.log('FILES', files);
    return files;
  });

  select(event: Event, type: string, value?: FileItem | TrackItem): void {
    event.stopPropagation();
    const currentSelectedItemId = this.projectStateService.getSelectedItem()?.id;
    if (currentSelectedItemId) {
      this.mapService.toggleLayerSelection(currentSelectedItemId);
    }
    let id = value?.id ?? '';
    if (type === 'project') {
      id = this.projectMetadata().id;
    }
    this.projectStateService.setSelectedItem(type, id);
    this.mapService.toggleLayerSelection(id);
  }

  isSelected(id: string): boolean {
    return this.projectStateService.isSelected(id);
  }

  handleAction(action: string) {
    switch (action) {
      case 'toggle-panel':
        this.uiStateService.togglePanel(PanelTypes.RIGHT);
        break;
      case 'new-project':
        break;
      case 'open-project':
        this.openImportDialog('hzx');
        break;
      case 'save-project':
        this.projectService.saveProject();
        break;
      case 'new-file':
        break;
      case 'open-file':
        this.openImportDialog('gpx');
        break;
      case 'save-file':
        // this.saveCurrentFile();
        break;
      case 'edit-project':
      case 'edit-file':
      case 'edit-track':
        this.openMetadataDialog();
        break;
      case 'cut-track':
        break;
    }
  }

  private openImportDialog(type?: string) {
    const dialogRef = this.dialog.open(ImportDialog, { data: type });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (type === 'gpx') {
          this.projectService.importProject(result);
        }
        if (type === 'hzx') {
          this.projectService.importFile(result);
        }
      }
    });
  }

  private openMetadataDialog() {
    const item = this.projectStateService.findSelectedItem();
    const type = this.projectStateService.getSelectedItem()?.type;
    if (item) {
      const edit: string[] = type === 'track' ? ['name', 'color'] : ['name'];
      const dialogRef = this.dialog.open(MetadataDialog, { data: { metadata: item.metadata, edit } });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          console.log(result);
          item.metadata = result;
          if (type === 'track') {
            this.projectStateService.updateItem(item as HzxTrack);
            const feature = this.gpxUtilsService.gettrackAsFeature(item as HzxTrack);
            this.mapService.updateVectorLayer(feature, true);
            this.mapService.replaceVectorLayer(item.metadata.id);
          }
        }
      });
    }
  }

  private getTracks(tracks: HzxTrack[]): TrackItem[] {
    if (!tracks) {
      return [];
    }
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
    if (!routes) {
      return [];
    }
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
    if (!waypoints) {
      return [];
    }
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
