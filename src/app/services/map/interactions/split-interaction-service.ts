import { inject, Injectable } from '@angular/core';
import Split from 'ol-ext/interaction/Split';
import { HzxFeature } from '../../project/model/hzxProject';
import { MapStateService } from '../state/map-state-service';
import { UtilsService } from '../../utils-service';
import Feature from 'ol/Feature';

@Injectable({
  providedIn: 'root',
})
export class SplitInteractionService {

  private mapState = inject(MapStateService);
  private utils = inject(UtilsService);

  private split = new Split();

  public addSplitter(id: string): void {
    const source = this.mapState.vectorLayers().get(id)?.getSource();
    if (source) {
      this.split = new Split({
        source: source
      });
      this.mapState.getMap().addInteraction(this.split);
      this.split.on('aftersplit', (event: any) => {
        Array.from(event.features).forEach((feature: any) => {
          feature.set('id', crypto.randomUUID());
          feature.setStyle(null);
        });
        this.mapState.setSplitResult(event);
      });
    }
  }

  public removeSplitter(): void {
    this.mapState.getMap().removeInteraction(this.split);
    this.split = new Split();
  }

}
