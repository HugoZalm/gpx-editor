import { Component, computed, input, output } from '@angular/core';
import { LucideBike, LucideBookmark, LucideChartArea, LucideFile, LucideFileDown, LucideFilePlus, LucideFileUp, LucideFolder, LucideFolderDown, LucideFolderOpen, LucideFolderPlus, LucideFolderTree, LucideFolderUp, LucideMapPin, LucidePencil, LucidePlus, LucideScissors, LucideSquareDashedMousePointer, LucideSquareMousePointer } from '@lucide/angular';
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
      case 'file':
        return LucideFile;
      case 'file-plus':
        return LucideFilePlus;
      case 'file-up':
        return LucideFileUp;
      case 'file-down':
        return LucideFileDown;
      case 'tree':
        return LucideFolderTree;
      case 'chart':
        return LucideChartArea;
      case 'pencil':
        return LucidePencil;
      case 'select': 
        return LucideSquareMousePointer;
      case 'clear-selection': 
        return LucideSquareDashedMousePointer;
      case 'bike':
      default:
        return LucideBike;
      };
  });


  emitAction(): void {
    this.onAction.emit(this.action() ?? '');
  }
}
