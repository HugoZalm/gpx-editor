import { GpxParseService } from './../../../../services/gpx/parser/gpx-parse-service';
import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MenuButtonComponent } from '../../buttons/menu-button/menu-button-component';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialog } from '../../dialogs/import/import-dialog';
import { PanelTypes, StateService } from '../../../../services/state/state-service';
import { GpxStateService } from '../../../../services/gpx/state/gpx-state-service';
import { GpxUtilsService } from '../../../../services/gpx/utils/gpx-utils-service';
import { MapService } from '../../../../services/map/map.service';
import { HzxGpx } from '../../../../services/gpx/model/hzxProject';
import testproject from '../../../../../assets/data/snackweekend.json';

@Component({
  selector: 'app-top-menu',
  imports: [MatButtonModule, MatMenuModule, MenuButtonComponent],
  templateUrl: './top-menu-component.html',
  styleUrl: './top-menu-component.scss',
})
export class TopMenuComponent {
  readonly dialog = inject(MatDialog);

  private stateService = inject(StateService);
  private mapService = inject(MapService);
  private gpxStateService = inject(GpxStateService);
  private gpxParseService = inject(GpxParseService);
  private gpxUtilsService = inject(GpxUtilsService);

  handleAction(action: string) {
    switch (action) {
      case 'open-test-project':
        this.openTestProject();
        break;
      case 'nieuw-project':
        break;
      case 'open-project':
        this.openImportDialog('hzx');
        break;
      case 'bewaar-project':
        this.saveProject();
        break;
      case 'nieuwe-file':
        break;
      case 'open-file':
        this.openImportDialog('gpx');
        break;
      case 'bewaar-file':
        // this.saveCurrentFile();
        break;
      case 'toggle-tree':
        this.stateService.togglePanel(PanelTypes.RIGHT);
        break;
      case 'toggle-info':
        this.stateService.togglePanel(PanelTypes.BOTTOM);
        break;
    }
  }

  private saveProject() {
    const filename = 'export.hzx';
    const project = this.gpxStateService.getProject();
    const json = JSON.stringify(project, null, 2);
    console.log('SAVED DATA', json);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  private openImportDialog(type?: string) {
    const dialogRef = this.dialog.open(ImportDialog, { data: type });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (type === 'gpx') {
          const gpx = this.gpxParseService.parse(result);
          if (gpx) {
            const id = this.gpxStateService.addFile(gpx);
            const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
            this.mapService.createVectorLayers(features);
            this.mapService.addMissingVectorLayers();
            if (id) {
              this.gpxStateService.setSelectedItem('gpx', id);
            }
          }
        }
        if (type === 'hzx') {
          const project = JSON.parse(result);
          this.gpxStateService.setProject(project);
          project.files.forEach((gpx: HzxGpx) => {
            const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
            this.mapService.createVectorLayers(features);
            this.mapService.addMissingVectorLayers();
          });
        }
      }
    });
  }

  private openTestProject() {
    const result = JSON.stringify(testproject);
    const gpx = this.gpxParseService.parse(result);
    if (gpx) {
      const id = this.gpxStateService.addFile(gpx);
      const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
      this.mapService.createVectorLayers(features);
      this.mapService.addMissingVectorLayers();
      if (id) {
        this.gpxStateService.setSelectedItem('gpx', id);
      }
    }
  }
}
