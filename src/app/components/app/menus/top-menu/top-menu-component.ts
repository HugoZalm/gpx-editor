import { GpxParseService } from './../../../../services/gpx/parser/gpx-parse-service';
import { Component, inject, signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MenuButtonComponent } from '../../buttons/menu-button/menu-button-component';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialog } from '../../dialogs/import/import-dialog';
import { GpxUtilsService } from '../../../../services/gpx/utils/gpx-utils-service';
import { MapService } from '../../../../services/map/map.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { TranslatePipe, TranslateService, _ } from '@ngx-translate/core';
import { ProjectStateService } from '../../../../services/project/state/project-state-service';
import { ProjectService } from '../../../../services/project/project-service';
import { PanelTypes, UiStateService } from '../../../../services/ui/ui-state-service';

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

  private uiStateService = inject(UiStateService);
  private projectService = inject(ProjectService);

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
        // this.projectService.saveProject();
        // this.saveProject();
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
        this.uiStateService.togglePanel(PanelTypes.RIGHT);
        break;
      case 'toggle-info':
        this.uiStateService.togglePanel(PanelTypes.BOTTOM);
        break;
    }
  }

  private openImportDialog(type?: string) {
    const dialogRef = this.dialog.open(ImportDialog, { data: type });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (type === 'gpx') {
          // this.projectService.importProject(result);
        }
        if (type === 'hzx') {
          // this.projectService.importFile(result);
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
        this.createButton('export-project', 'menu.exportproject', 'folder-output', 'menu.exportproject.tooltip'),
        this.createButton('hr'),
        this.createButton('new-file', 'menu.newfile', 'file-plus', 'menu.newfile.tooltip'),
        this.createButton('open-file', 'menu.importfile', 'file-up', 'menu.importfile.tooltip'),
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
