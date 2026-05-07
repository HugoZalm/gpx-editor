import { HzxGpx } from './../../../services/project/model/hzxProject';
import { ProjectService } from './../../../services/project/project-service';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MenuButtonComponent } from '../buttons/menu-button/menu-button-component';
import { HzxItem, HzxTrack } from '../../../services/project/model/hzxProject';
import { PanelTypes, UiStateService } from '../../../services/ui/ui-state-service';
import { ImportDialog } from '../dialogs/import/import-dialog';
import { MetadataDialog, MetadataDialogData } from '../dialogs/metadata/metadata-dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CoreService } from '../../../services/core-service';
import { ProjectStateService } from '../../../services/project/state/project-state-service';
import { WipDialog } from '../dialogs/work-in-progress/wip-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectDialog } from '../dialogs/select/select-dialog';
import project from './project.json';


@Component({
  selector: 'app-project-component',
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MenuButtonComponent,
    TranslatePipe,
    MatTooltipModule
  ],
  templateUrl: './project-component.html',
  styleUrl: './project-component.scss',
})
export class ProjectComponent {
  readonly dialog = inject(MatDialog);

  private coreService = inject(CoreService);
  public projectStateService = inject(ProjectStateService);
  public uiStateService = inject(UiStateService);

  private clickedItem: HzxItem | undefined = undefined;

  ngOnInit() {
    const string = JSON.stringify(project);
    this.coreService.replaceProject(string);
  }

  selectTrack(event: Event, item: HzxTrack): void {
    event.stopPropagation();
    this.coreService.toggleSelection(item);
  }

  selectForAction(event: Event, item?: HzxItem): void {
    event.stopPropagation();
    this.clickedItem = item;
  }

  isSelected(id: string): boolean {
    return this.coreService.isSelected(id);
  }

  handleAction(action: string) {
    let id;
    switch (action) {
      case 'toggle-panel':
        this.uiStateService.togglePanel(PanelTypes.RIGHT);
        break;
      case 'edit-project':
        this.openMetadataDialog();
        break;
      case 'new-project':
        this.coreService.newProject();
        break;
      case 'open-project':
        this.openImportDialog('hzx');
        break;
      case 'save-project':
        this.coreService.saveProject();
        break;
      case 'export-project':
        this.openWipDialog();
        break;
      case 'new-file':
        this.coreService.addFileToProject();
        break;
      case 'open-file':
        this.openImportDialog('gpx');
        break;
      case 'edit-file':
        this.openMetadataDialog();
        break;
      case 'goto-file':
        this.goto();
        break;
      case 'save-file':
        this.openWipDialog();
        break;
      case 'export-file':
        this.openWipDialog();
        break;
      case 'duplicate-file':
        this.openWipDialog();
        break;
      case 'delete-file':
        id = this.clickedItem?.metadata.id;
        if (id) {
          this.coreService.removeFileFromProject(id);
        }
        break;
      case 'new-track':
        id = this.clickedItem?.metadata.id;
        if (id) {
          this.coreService.addNewTrackToFile(id);
        }
        break;
      case 'edit-track':
        this.openMetadataDialog();
        break;
      case 'goto-track':
        this.goto();
        break;
      case 'copy-track':
        id = this.clickedItem?.metadata.id;
        if (id) {
          this.openCopyToDialog();
        }
        break;
      case 'delete-track':
        id = this.clickedItem?.metadata.id;
        if (id) {
          this.coreService.removeTrackFromFile(id);
        }
        break;
      case 'cut-track':
        this.openWipDialog();
        break;
      case 'clear-selection':
        this.coreService.clearSelection();
        break;
    }
    this.clickedItem = undefined;
  }

  private openWipDialog() {
    this.dialog.open(WipDialog);
  }

  private goto(): void {
    const item = this.clickedItem;
    if(item) {
      this.coreService.gotoSelectedItem(item);
    }
  }

  private openImportDialog(type?: string) {
    const dialogRef = this.dialog.open(ImportDialog, { data: type });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (type === 'gpx') {
          this.coreService.addFileToProject(result);
        }
        if (type === 'hzx') {
          this.coreService.replaceProject(result);
        }
      }
    });
  }

  private openMetadataDialog() {
    const item = this.clickedItem;
    if (item) {
      const edit: string[] = 'track' in item ? ['name', 'color'] : ['name'];
      const dialogRef = this.dialog.open(MetadataDialog, { data: { metadata: item.metadata, edit } });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          console.log(result);
          this.coreService.editMetadata(result);
        }
      });
    }
  }

  private openCopyToDialog() {
    const item = this.clickedItem;
    if (item && this.coreService.isType('track', item)) {
      const title = 'dialog.selectFile';
      let list: { label: string, value: string }[] = [];
      list = this.projectStateService.project().files.map( (file: HzxGpx) => {
        return { label: file.metadata.name, value: file.metadata.id }
      });
      const dialogRef = this.dialog.open(SelectDialog, { data: {title, list }});
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          console.log('SELECTED', result);
          const fileId = result;
          this.coreService.copyTrackToFile(item as HzxTrack, fileId);
        }
      });
    }
  }

  // private getTracks(tracks: HzxTrack[]): TrackItem[] {
  //   if (!tracks) {
  //     return [];
  //   }
  //   const items = tracks.map((track) => {
  //     return {
  //       id: track.metadata.id,
  //       name: track.metadata.name,
  //       color: track.metadata.color,
  //       track: track,
  //     } as TrackItem;
  //   });
  //   return items;
  // }

  // private getRoutes(routes: HzxRoute[]): RouteItem[] {
  //   if (!routes) {
  //     return [];
  //   }
  //   const items = routes.map((route) => {
  //     return {
  //       id: route.metadata.id,
  //       name: route.metadata.name,
  //       color: route.metadata.color,
  //       route: route,
  //     } as RouteItem;
  //   });
  //   return items;
  // }

  // private getWaypoints(waypoints: HzxWaypoint[]): WaypointItem[] {
  //   if (!waypoints) {
  //     return [];
  //   }
  //   const items = waypoints.map((waypoint) => {
  //     return {
  //       id: waypoint.metadata.id,
  //       name: waypoint.metadata.name,
  //       color: waypoint.metadata.color,
  //       waypoint: waypoint,
  //     } as WaypointItem;
  //   });
  //   return items;
  // }

}
