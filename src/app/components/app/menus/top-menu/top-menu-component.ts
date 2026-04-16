import { GpxParseService } from './../../../../services/gpx/parse/gpx-parse-service';
import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MenuButtonComponent } from "../../buttons/menu-button/menu-button-component";
import { MatDialog } from '@angular/material/dialog';
import { ImportDialog } from '../../dialogs/import/import-dialog';
import { PanelTypes, StateService } from '../../../../services/state/state-service';
import { GpxStateService } from '../../../../services/gpx/state/gpx-state-service';
import { ProjectsDialog } from '../../dialogs/projects/projects-dialog';

@Component({
  selector: 'app-top-menu',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MenuButtonComponent
],
  templateUrl: './top-menu-component.html',
  styleUrl: './top-menu-component.scss',
})
export class TopMenuComponent {
  readonly dialog = inject(MatDialog);

  private stateService = inject(StateService);
  private gpxStateService = inject(GpxStateService);
  private gpxParseService = inject(GpxParseService);


  handleAction(action: string) {
    // alert(action + '-button clicked');
    switch(action){
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
    // const data = this.gpxStateService.getProject();
    // const json = JSON.stringify(data, null, 2);
    const json = this.gpxStateService.getProjectAsString();
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
    const dialogRef = this.dialog.open(ImportDialog, { data: type});
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log(result);
        if (type === 'gpx') {
          const name = this.gpxParseService.parse(result);
          if (name) {
            this.gpxStateService.setCurrentFile(name);
          }
        }
        if (type === 'hzx') {
          this.gpxStateService.setProject(result);
        }
      }
    });
  }

  private openProjectenDialog(result: unknown[]) {
    console.log('PROJECTEN', result);
    const dialogRef = this.dialog.open(ProjectsDialog, {
      data: result
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log(result);
        const name = this.gpxParseService.parse(result);
        if (name) {
          this.gpxStateService.setCurrentFile(name);
        }
      }
    });
  }

}
