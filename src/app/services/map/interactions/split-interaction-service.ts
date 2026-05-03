import { inject, Injectable } from '@angular/core';
import Split from 'ol-ext/interaction/Split';
import { HzxFeature } from '../../project/model/hzxProject';
import { MapStateService } from '../state/map-state-service';
import { UtilsService } from '../../utils-service';

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
        console.log('Original feature:', event.original);
        console.log('New features:', event.features);
        Array.from(event.features).forEach((feature: any) => {
          console.log('feature:', feature);
          const metadata = { id: crypto.randomUUID(), name: this.utils.getRandomName(), color: this.utils.getRandomColor() };
          const hzxFeature: HzxFeature = { metadata, feature };
          // this.createVectorLayer(hzxFeature);
        });
        // this.removeVectorLayer(id);
        // this.addMissingVectorLayers();
      });
    }
  }

  public removeSplitter(): void {
    this.split = new Split();
  }

}
