import { inject, Injectable } from '@angular/core';
import { MapStateService } from '../state/map-state-service';
import { HzxFeature } from '../../project/model/hzxProject';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Stroke, Style } from 'ol/style';

@Injectable({
  providedIn: 'root',
})
export class VectorLayerService {

  private mapState = inject(MapStateService);

  public createVectorLayers(features: HzxFeature[]): string[] {
    const layerIds: string[] = [];
    features.forEach((feature) => {
      const id = this.createVectorLayer(feature);
      layerIds.push(id);
    });
    return layerIds;
  }
    
  public createVectorLayer(feature: HzxFeature): string {
    const id = feature.metadata.id;
    feature.feature.set('id', id)
    const vectorSource = new VectorSource({
      features: [feature.feature]
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });
    vectorLayer.set('id', id);
    vectorLayer.set('name', feature.metadata.name);
    vectorLayer.set('color', feature.metadata.color);
    vectorLayer.set('selected', false);
    vectorLayer.setStyle(this.createLayerStyle(vectorLayer));
    this.mapState.upsertVectorLayer(id, vectorLayer);
    this.mapState.getMap().addLayer(vectorLayer);
    return id;
  }

  public updateVectorLayer(feature: HzxFeature, selected?: boolean): string {
    const id = feature.metadata.id;
    const layer = this.mapState.vectorLayers().get(id);
    if (layer) {
      this.mapState.removeVectorLayer(id);
      this.mapState.getMap().addLayer(layer);
    }
    const vectorSource = new VectorSource({
      features: [feature.feature]
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });
    vectorLayer.set('id', id);
    vectorLayer.set('name', feature.metadata.name);
    vectorLayer.set('color', feature.metadata.color);
    vectorLayer.set('selected', selected ?? false);
    vectorLayer.setStyle(this.createLayerStyle(vectorLayer));
    this.mapState.upsertVectorLayer(id, vectorLayer);
    this.mapState.getMap().addLayer(vectorLayer);
    return id;
  }

  public removeAllVectorLayers() {
    Array.from(this.mapState.vectorLayers().entries()).forEach((entry) => {
      this.mapState.removeVectorLayer(entry[0]);
      this.mapState.getMap().removeLayer(entry[1]);
    });
  }

  public removeVectorLayers(layerIds: string[]) {
    Array.from(this.mapState.vectorLayers().entries()).forEach((entry) => {
      if (layerIds.includes(entry[0])) {
        this.mapState.removeVectorLayer(entry[0]);
        this.mapState.getMap().removeLayer(entry[1]);
      }
    });
  }

  public removeVectorLayer(id: string) {
    const layer = this.mapState.vectorLayers().get(id);
    if (layer) {
      this.mapState.removeVectorLayer(id);
      this.mapState.getMap().removeLayer(layer);
    }
  }

  public toggleVectorLayerSelection(id: string) {
    const layer = this.mapState.getMap().getLayers().getArray().find(layer => layer.get('id') === id);
    if (layer) {
      const newState = !layer.get('selected');
      layer.set('selected', newState);
      layer.changed(); // important
    }
  }

  private createLayerStyle(layer: VectorLayer) {
    return (feature: any, resolution: any) => {
      return new Style({
        stroke: new Stroke({
          color: layer.get('color'),
          width: layer.get('selected') ? 6 : 3
        })
      });
    };
  }

}
