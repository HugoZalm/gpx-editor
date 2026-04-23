import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button-component';
import { UiStateService, PanelTypes } from '../../../../services/ui/ui-state-service';
import { ProjectComponent } from '../../project/project-component';
import { SettingsComponent } from "../../settings/settings-component";
import { DocumentationComponent } from '../../documentation/documentation-component';
import { Translate } from 'ol/interaction';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-right-panel',
  imports: [
    CommonModule,
    ProjectComponent,
    SettingsComponent,
    DocumentationComponent,
    IconButtonComponent
],
  templateUrl: './right-panel-component.html',
  styleUrl: './right-panel-component.scss',
})
export class RightPanelComponent {

  public uiStateService = inject(UiStateService);
  public showProject = signal<boolean>(true);
  public showSettings = signal<boolean>(false);
  public showDocumentation = signal<boolean>(false);

  handleAction(action: string) {
    switch (action) {
      case 'toggle-panel':
        this.uiStateService.togglePanel(PanelTypes.RIGHT);
        break;
      case 'show-settings':
        this.closeAll();
        this.showSettings.set(true);
        break;
      case 'show-documentation':
        this.closeAll();
        this.showDocumentation.set(true);
        break;
      case 'show-project':
        this.closeAll();
        this.showProject.set(true);
        break;
    }
  }

  private closeAll() {
    this.showSettings.set(false);
    this.showDocumentation.set(false);
    this.showProject.set(false);
  }

}
