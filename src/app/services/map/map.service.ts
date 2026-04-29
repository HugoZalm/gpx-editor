import { VectorLayerService } from './layers/vector-layer-service';
import { SplitInteractionService } from './interactions/split-interaction-service';
import { SelectInteractionService } from './interactions/select-interaction-service';
import { BaseLayerService } from './layers/base-layer-service';
import { inject, Injectable } from "@angular/core";
import olMap from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { Coordinate, createStringXY } from "ol/coordinate";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { getPointResolution } from "ol/proj.js";
import { Stroke, Style } from "ol/style";
import WKT from "ol/format/WKT";
import {createEmpty, extend, Extent, getCenter} from 'ol/extent';
import { MapStateService } from "./state/map-state-service";
import { defaults as defaultInteractions } from 'ol/interaction';
import { HzxFeature } from "../project/model/hzxProject";
import { UtilsService } from "../utils-service";


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

  /** Attach the map to a DOM element */
  public setTarget(target: HTMLElement): void {
    this.mapState.getMap().setTarget(target);
  }

  /** Detach map (important when component is destroyed) */
  public clearTarget(): void {
    this.mapState.getMap().setTarget(undefined);
  }

  /** Access to the raw OpenLayers Map */
  public getMap(): olMap {
    return this.mapState.getMap();
  }

  public setCenterFromLonLat(lon: number, lat: number, zoom?: number): void {
    const view = this.mapState.getMap().getView();
    view.setCenter(fromLonLat([lon, lat]));
    if (zoom !== undefined) {
      view.setZoom(zoom);
    }
  }

  // public setCenterFromCoordinate(coordinate: Coordinate, zoom?: number): void {
  //   const view = this.mapState.getMap().getView();
  //   view.setCenter(coordinate);
  //   if (zoom !== undefined) {
  //     view.setZoom(zoom);
  //   }
  // }

  // public fitGeom(geom: string): void {
  //   const wktFormat = new WKT();
  //   const feature = wktFormat.readFeature(geom, {
  //     dataProjection: "EPSG:4326",
  //     featureProjection: "EPSG:3857",
  //   });
  //   const geometry = feature.getGeometry();
  //   let extent = createEmpty();
  //   if (geometry) {
  //     extend(extent, geometry.getExtent());
  //     this.mapState.getMap().getView().fit(extent, {
  //       padding: [40, 40, 40, 40],
  //       duration: 500,
  //       maxZoom: 18
  //     });
  //   }
  // }
  
  // public getView(): View {
  //   return this.mapState.getMap().getView();
  // }

  // public getViewCenter(): string {
  //   const center = this.mapState.getMap().getView().getCenter();
  //   const stringifyFunc = createStringXY(2);
  //   const viewCenter = center ? stringifyFunc(center) : "5, 51";
  //   return `[${viewCenter}]`;
  // }

  // public getViewZoom(): string {
  //   const zoom = this.mapState.getMap().getView().getZoom();
  //   return zoom ? `${zoom}` : "10";
  // }

  // public getScale(): number {
  //   let scale: number = 1000;
  //   const resolution = this.mapState.getMap().getView().getResolution();
  //   const projection = this.mapState.getMap().getView().getProjection();
  //   const center = this.mapState.getMap().getView().getCenter();
  //   if (resolution && center) {
  //     const pointResolution = getPointResolution(
  //       projection,
  //       resolution,
  //       center,
  //       "m", // Target units: 'm' for meters
  //     );
  //     const dpi = 96;
  //     const inchesPerMeter = 39.37;
  //     scale = Math.round(pointResolution * dpi * inchesPerMeter);
  //   }
  //   return scale;
  // }

}
