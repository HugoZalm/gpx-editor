import { inject, Injectable } from '@angular/core';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { MapStateService } from '../state/map-state-service';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { InteractionStates } from '../model/interaction-states.enum';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Geometry from 'ol/geom/Geometry';
import { Coordinate } from 'ol/coordinate';

@Injectable({
  providedIn: 'root',
})
export class SelectInteractionService {

  private mapState = inject(MapStateService);

  private select!: Select;

  public addSelection() {
    const select = new Select();
    this.mapState.getMap().addInteraction(select);
    this.mapState.setSelect(select);
    this.mapState.getSelect().setActive(false);
  }

  public removeSelection() {
    this.select.getFeatures().clear();
    this.mapState.getMap().removeInteraction(this.select);
    this.select = new Select();
  }

}
