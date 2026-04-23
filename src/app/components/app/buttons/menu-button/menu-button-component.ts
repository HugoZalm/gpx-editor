import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconButtonComponent } from "../icon-button/icon-button-component";
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-menu-button',
  imports: [
    MatButtonModule,
    MatTooltipModule,
    IconButtonComponent,
    TranslatePipe,
    TitleCasePipe
],
  templateUrl: './menu-button-component.html',
  styleUrl: './menu-button-component.scss',
})
export class MenuButtonComponent {
  icon = input<string>();
  label = input<string>();
  iconSize = input<number>();
  shortKey = input<string>();
  action = input<string>();
  tooltip = input<string>();
  onAction = output<string>();

  emitAction(): void {
    this.onAction.emit(this.action() ?? '');
  }
}
