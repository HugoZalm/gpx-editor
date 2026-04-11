import { Component, computed, input, output } from '@angular/core';
import { LucideFolderOpen, LucideMapPin, LucidePencil, LucidePlus, LucideScissors } from '@lucide/angular';
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
      case 'pencil':
      default:
        return LucidePencil;
    };
  });


  emitAction(): void {
    this.onAction.emit(this.action() ?? '');
  }
}
