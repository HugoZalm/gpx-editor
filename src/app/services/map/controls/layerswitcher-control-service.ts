import { inject, Injectable } from '@angular/core';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import { MapStateService } from '../state/map-state-service';

@Injectable({
  providedIn: 'root',
})
export class LayerswitcherControlService {

  private mapState = inject(MapStateService);


  public addLayerSwitcher() {
    const ctrl = new LayerSwitcher({
      // collapsed: false,
      // mouseover: true
    });
    this.mapState.getMap().addControl(ctrl);
  }

}
