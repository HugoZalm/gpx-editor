import { GpxParseService } from './../../../../services/gpx/parser/gpx-parse-service';
import { Component, inject, signal } from '@angular/core';
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
import { CommonModule, TitleCasePipe } from '@angular/common';
import { TranslatePipe, TranslateService, _ } from '@ngx-translate/core';

export interface MenuItem {
  id: string;
  label: string;
  buttons: MenuButton[];
}

export interface MenuButton {
  label: string | undefined;
  icon: string | undefined;
  action: string;
  tooltip: string | undefined;
}


@Component({
  selector: 'app-top-menu',
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MenuButtonComponent,
    TranslatePipe,
    TitleCasePipe
  ],
  templateUrl: './top-menu-component.html',
  styleUrl: './top-menu-component.scss',
})
export class TopMenuComponent {
  readonly dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  private stateService = inject(StateService);
  private mapService = inject(MapService);
  private gpxStateService = inject(GpxStateService);
  private gpxParseService = inject(GpxParseService);
  private gpxUtilsService = inject(GpxUtilsService);

  public menuItems = signal<MenuItem[]>([]);
  // private translations: any = {};

  constructor() {
    this.createMenuItems();
    // this.translate.get(_('menu')).subscribe({
    //   next: (res) => {
    //     // console.log('RES', res);
    //     this.translations = res;
    //   },
    //   error: (err) => console.error('ERROR', err)
    // });
  }

  handleAction(action: string) {
    switch (action) {
      case 'new-project':
        break;
      case 'open-project':
        this.openImportDialog('hzx');
        break;
      case 'save-project':
        this.saveProject();
        break;
      case 'new-file':
        break;
      case 'open-file':
        this.openImportDialog('gpx');
        break;
      case 'save-file':
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

  private createMenuItems() {
    const items: MenuItem[] = [];
    items.push({ 
      id: 'project', 
      label: 'menu.project',
      buttons: [
        this.createButton('new-project', 'menu.newproject', 'folder-plus', 'menu.newproject.tooltip'),
        this.createButton('open-project', 'menu.openproject', 'folder-up', 'menu.openproject.tooltip'),
        this.createButton('save-project', 'menu.saveproject', 'folder-down', 'menu.saveproject.tooltip'),
        this.createButton('export-project', 'menu.exportproject', 'folder-down', 'menu.exportproject.tooltip'),
        this.createButton('hr'),
        this.createButton('new-file', 'menu.newfile', 'folder-plus', 'menu.newfile.tooltip'),
        this.createButton('open-file', 'menu.importfile', 'folder-up', 'menu.importfile.tooltip'),
      ]
    });
    items.push({ 
      id: 'manage', 
      label: 'menu.manage',
      buttons: []
    });
    items.push({ 
      id: 'display', 
      label: 'menu.display',
      buttons: [
        this.createButton('toggle-tree', 'menu.display.treepanel', 'tree', 'menu.display.treepanel.tooltip'),
        this.createButton('toggle-info', 'menu.display.infopanel', 'chart', 'menu.display.treepanel.tooltip'),
      ]
    });
    items.push({ 
      id: 'settings', 
      label: 'menu.settings',
      buttons: [
        this.createButton('language', 'menu.settings.layers', 'language', 'menu.settings.layers.tooltip'),
        this.createButton('hr'),
        this.createButton('map-layers', 'menu.settings.layers', 'layers', 'menu.settings.layers.tooltip'),
      ]
    });
    items.push({ 
      id: 'help', 
      label: 'menu.help',
      buttons: [
        this.createButton('documentation', 'menu.help.documentation', 'documentation', 'menu.help.documentation.tooltip'),
        this.createButton('about', 'menu.help.about', 'about', 'menu.help.about.tooltip'),

      ]
    });
    this.menuItems.set(items);
  }

  private createButton(action: string, label?: string, icon?: string, tooltip?: string) {
    return { label, icon, action, tooltip };
  }

}
