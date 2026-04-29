import { inject, Injectable } from '@angular/core';
import Select from 'ol/interaction/Select';
import { MapStateService } from '../state/map-state-service';
import MapBrowserEvent from 'ol/MapBrowserEvent';

@Injectable({
  providedIn: 'root',
})
export class SelectInteractionService {

  private mapState = inject(MapStateService);

  private select!: Select;

  public addSelection() {
    this.select = new Select();
    this.mapState.getMap().addInteraction(this.select);
    this.mapState.getMap().on('singleclick', (event) => this.onSelect(event));
    this.mapState.hasSelectInteraction.set(true);
  }

  public removeSelection() {
    this.mapState.getMap().removeInteraction(this.select);
    this.mapState.hasSelectInteraction.set(false);
  }

  private onSelect(event: MapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>) {
    const feature = this.select.getFeatures().item(0);
    if (!feature) return;
    console.log('CLICKED on feature', feature);
  }

}
