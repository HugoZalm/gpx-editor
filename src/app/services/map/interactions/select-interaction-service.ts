import { inject, Injectable } from '@angular/core';
import Select from 'ol/interaction/Select';
import { MapStateService } from '../state/map-state-service';
import {always} from 'ol/events/condition.js';

@Injectable({
  providedIn: 'root',
})
export class SelectInteractionService {

  private mapState = inject(MapStateService);

  private select!: Select;

  public addSelection() {
    const select = new Select({
        toggleCondition: always,
        multi: true,
    });
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
