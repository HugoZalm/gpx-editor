import { Injectable, signal } from '@angular/core';

export interface Panels {
  right: boolean;
  bottom: boolean;
}

export enum PanelTypes {
  RIGHT = 'top',
  BOTTOM = 'bottom'
}

@Injectable({
  providedIn: 'root',
})
export class UiStateService {

  panels = signal<Panels>({ right: true, bottom: false});

  togglePanel(type: PanelTypes) {
    switch(type) {
      case PanelTypes.BOTTOM:
        this.panels.update(p => ({
          ...p,
          bottom: !this.panels().bottom
        }));
        break;
      case PanelTypes.RIGHT:
        this.panels.update(p => ({
          ...p,
          right: !this.panels().right
        }));
        break;
    }
    console.log('Panels state changed', this.panels());
  }

}
