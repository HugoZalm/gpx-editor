import { Injectable, signal } from '@angular/core';
import { InteractionStates } from '../map/model/interaction-states.enum';

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

  private _panels = signal<Panels>({ right: true, bottom: false});
  public readonly panels = this._panels.asReadonly();

  private _interactionState = signal<InteractionStates>(InteractionStates.NONE);
  public readonly interactionState = this._interactionState.asReadonly();


  togglePanel(type: PanelTypes) {
    switch(type) {
      case PanelTypes.BOTTOM:
        this._panels.update(p => ({
          ...p,
          bottom: !this._panels().bottom
        }));
        break;
      case PanelTypes.RIGHT:
        this._panels.update(p => ({
          ...p,
          right: !this._panels().right
        }));
        break;
    }
    console.log('Panels state changed', this._panels());
  }

}
