import { Component } from '@angular/core';
import { IconButtonComponent } from "../../buttons/icon-button/icon-button-component";

@Component({
  selector: 'app-left-menu',
  imports: [IconButtonComponent],
  templateUrl: './left-menu-component.html',
  styleUrl: './left-menu-component.scss',
})
export class LeftMenuComponent {

  handleAction(action: string) {
    alert(action + '-button clicked');
  }
}
