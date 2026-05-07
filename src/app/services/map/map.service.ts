import { VectorLayerService } from './layers/vector-layer-service';
import { SplitInteractionService } from './interactions/split-interaction-service';
import { SelectInteractionService } from './interactions/select-interaction-service';
import { BaseLayerService } from './layers/base-layer-service';
import { inject, Injectable } from "@angular/core";
import olMap from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import { createEmpty, extend } from 'ol/extent';
import { MapStateService } from "./state/map-state-service";
import { defaults as defaultInteractions } from 'ol/interaction';
import { HzxFeature } from "../project/model/hzxProject";


@Injectable({
  providedIn: "root",
})
export class MapService {

  private mapState = inject(MapStateService);
  private baseLayerService = inject(BaseLayerService);
  private vectorLayerService = inject(VectorLayerService);
  private selectInteractionService = inject(SelectInteractionService);
  private splitInteractionService = inject(SplitInteractionService);

  constructor() {
    this.createMap();
    this.baseLayerService.createOsmLayer();
    // this.baseLayerService.createOpenTopoLayer();
  }

  /* MAP */
  private createMap(): void {
    const map = new olMap({
      interactions: defaultInteractions(),
      controls: [],
      layers: [],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
        projection: "EPSG:3857",
      }),
    });
    this.mapState.setMap(map);
  }

  /** Attach the map to a DOM element */
  public setTarget(target: HTMLElement): void {
    this.mapState.getMap().setTarget(target);
  }

  /** Detach map (important when component is destroyed) */
  public clearTarget(): void {
    this.mapState.getMap().setTarget(undefined);
  }

  public setCenterFromLonLat(lon: number, lat: number, zoom?: number): void {
    const view = this.mapState.getMap().getView();
    view.setCenter(fromLonLat([lon, lat]));
    if (zoom !== undefined) {
      view.setZoom(zoom);
    }
  }

  public gotoSelectedItems(ids: string[]): void {
    const combined = createEmpty();
    ids.forEach((id: string) => {
      const layer = this.getVectorLayer(id);
      const source = layer?.getSource();
      const extent = source?.getExtent();
      if (extent) {
        extend(combined, extent);
      }

    })
    if (combined) {
      this.mapState.getMap().getView().fit(combined, { padding: [50, 50, 50, 50] });
    }
  }

  public gotoSelectedItem(id: string): void {
    const layer = this.getVectorLayer(id);
    const source = layer?.getSource();
    const extent = source?.getExtent()
    if (extent) {
      this.mapState.getMap().getView().fit(extent, { padding: [50, 50, 50, 50] });
    }
  }

  /* VECTORLAYERS */
  getVectorLayer(id: string): VectorLayer | undefined {
    return this.mapState.vectorLayers().get(id);
  }

  createVectorLayers(features: HzxFeature[]): string[] {
    return this.vectorLayerService.createVectorLayers(features);
  }

  createVectorLayer(feature: HzxFeature): string {
    return this.vectorLayerService.createVectorLayer(feature);
  }

  updateVectorLayer(feature: HzxFeature, selected?: boolean): string {
    return this.vectorLayerService.updateVectorLayer(feature, selected);
  }

  removeAllVectorLayers() {
    this.vectorLayerService.removeAllVectorLayers();
  }

  removeVectorLayers(layerIds: string[]) {
    this.vectorLayerService.removeVectorLayers(layerIds);
  }

  removeVectorLayer(id: string) {
    this.vectorLayerService.removeVectorLayer(id);
  }

  public toggleVectorLayerSelection(id: string) {
    this.vectorLayerService.toggleVectorLayerSelection(id);
  }

  /* INTERACTIONS */
  setSelection(active: boolean) {
    if (active === true) {
      this.selectInteractionService.addSelection();
    } else {
      this.selectInteractionService.removeSelection();
    }
  }

  setSplitter(id?: string) {
    if (id) {
      this.splitInteractionService.addSplitter(id);
    } else {
      this.splitInteractionService.removeSplitter();
    }
  }

}
