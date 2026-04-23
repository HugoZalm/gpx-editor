import { Component, computed, input, output } from '@angular/core';
import { LucideBike, LucideBook, LucideBookmark, LucideChartArea, LucideCombine, LucideCopy, LucideFile, LucideFileDown, LucideFileOutput, LucideFilePlus, LucideFileUp, LucideFolder, LucideFolderDown, LucideFolderOpen, LucideFolderOutput, LucideFolderPlus, LucideFolderTree, LucideFolderUp, LucideMapPin, LucidePanelBottomClose, LucidePanelBottomOpen, LucidePanelRightClose, LucidePanelRightOpen, LucidePencil, LucidePlus, LucideScissors, LucideSettings, LucideSquareDashedMousePointer, LucideSquareMousePointer, LucideTrash, LucideX } from '@lucide/angular';
import { LucideDynamicIcon } from '@lucide/angular';
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon-button',
  imports: [
    LucideDynamicIcon,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './icon-button-component.html',
  styleUrl: './icon-button-component.scss',
})
export class IconButtonComponent {
  icon = input<string>();
  action = input<string>();
  tooltip = input<string>();
  iconSize = input<number>();
  onAction = output<string>();

  readonly lucidSize = (() => {
    return this.iconSize() ? this.iconSize() : 24;
  })

  readonly lucidIcon = computed(() => {
    switch(this.icon()) {
      case 'scissors':
        return LucideScissors;
      case 'poi':
        return LucideMapPin;
      case 'folder-open':
        return LucideFolderOpen;
      case 'add':
        return LucidePlus;
      case 'folder':
        return LucideFolder;
      case 'folder-plus':
        return LucideFolderPlus;
      case 'folder-up':
        return LucideFolderUp;
      case 'folder-down':
        return LucideFolderDown;
      case 'folder-output':
        return LucideFolderOutput;
      case 'file':
        return LucideFile;
      case 'file-plus':
        return LucideFilePlus;
      case 'file-up':
        return LucideFileUp;
      case 'file-down':
        return LucideFileDown;
      case 'file-output':
        return LucideFileOutput;
      case 'tree':
        return LucideFolderTree;
      case 'chart':
      case 'chart-area':
        return LucideChartArea;
      case 'chart-no-axes-combined':
        return LucideChartArea;
      case 'pencil':
        return LucidePencil;
      case 'select': 
        return LucideSquareMousePointer;
      case 'clear-selection': 
        return LucideSquareDashedMousePointer;
      case 'close':
        return LucideX;
      case 'combine':
        return LucideCombine;
      case 'copy':
        return LucideCopy;
      case 'delete':
      case 'trash':
        return LucideTrash;
      case 'panel-bottom-open':
        return LucidePanelBottomOpen;
      case 'panel-bottom-close':
        return LucidePanelBottomClose;
      case 'panel-right-open':
        return LucidePanelRightOpen;
      case 'panel-right-close':
        return LucidePanelRightClose;
      case 'settings':
        return LucideSettings;
      case 'book':
      case 'documentation':
        return LucideBook;
      case 'bike':
      default:
        return LucideBike;
      };
  });


  emitAction(): void {
    this.onAction.emit(this.action() ?? '');
  }
}
