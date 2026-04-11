import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MenuButtonComponent } from "../../buttons/menu-button/menu-button-component";

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
  handleAction(action: string) {
    alert(action + '-button clicked');
  }
}
