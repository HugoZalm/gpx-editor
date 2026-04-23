import { inject, Injectable } from "@angular/core";
import olMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat } from "ol/proj";
import { Coordinate, createStringXY } from "ol/coordinate";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { getPointResolution } from "ol/proj.js";
import { Stroke, Style } from "ol/style";
import XYZ from "ol/source/XYZ";
import WKT from "ol/format/WKT";
import {createEmpty, extend, Extent, getCenter} from 'ol/extent';
import { HzxFeature } from "../gpx/model/hzxProject";
import { MapStateService } from "./map-state-service";
import { defaults as defaultInteractions } from 'ol/interaction';
import Select from 'ol/interaction/Select.js';
import MapBrowserEvent from "ol/MapBrowserEvent";


// define your custom properties
// type TrackProperties = {
//   typeId?: 'styleId';
// };


@Injectable({
  providedIn: "root",
})
export class MapService {

  private mapState = inject(MapStateService);

  private currentView!: View;
  private map!: olMap;
  private select!: Select;

  constructor() {
    this.createMap();
    this.createBaseLayers();
    // this.addBaseLayers();
    // this.addBaseLayer('opentopo');
    this.addBaseLayer('osm');
    // this.addListeners();
  }

  private createBaseLayers() {
    this.createOpenTopoLayer();
    this.createOsmLayer();
  }

  private addListeners() {
    this.select = new Select();
    this.map.addInteraction(this.select);
    this.map.on("moveend", () => this.onMoveEnd());
    this.map.on('singleclick', (event) => this.onSelect(event));
  }
      
  private onSelect(event: MapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>) {
    const feature = this.select.getFeatures().item(0);
    if (!feature) return;
    console.log('CLICKED on feature', feature);
  }

  private onMoveEnd() {}

  private createMap(): void {
    this.map = new olMap({
      interactions: defaultInteractions(),
      controls: [],
      layers: [],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
        projection: "EPSG:3857",
      }),
    });
    this.currentView = this.map.getView();
  }

  private addBaseLayers() {
    Array.from(this.mapState.getBaseLayers().values()).forEach(layer => {
      this.map.addLayer(layer);
    });
  }

  private addBaseLayer(name: string) {
    const layer = this.mapState.getBaseLayers().get(name);
    if (layer) {
      this.map.addLayer(layer);
    }
  }

  private createOsmLayer(): void {
    const osm = new TileLayer({
      source: new OSM(),
    });
    this.mapState.upsertBaseLayer('osm', osm);
  }

  private createOpenTopoLayer(): void {
    const opentopo = new TileLayer({
      source: new XYZ({
        url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attributions:
          "© OpenStreetMap contributors, SRTM | © OpenTopoMap (CC-BY-SA)",
      }),
    });
    this.mapState.upsertBaseLayer('opentopo', opentopo);
  }

  public addMissingVectorLayers() {
      Array.from(this.mapState.getVectorLayers().values()).forEach(layer => {
        const found = this.map.getLayers().getArray().find(l => l === layer);
        if (!found) {
          this.map.addLayer(layer);
        }
    });
  }

  public replaceVectorLayer(id: string) {
    const found = this.map.getLayers().getArray().find(l => l.get('id') === id);
      if (found) {
        const layer = this.mapState.getVectorLayers().get(id);
        if (layer) {
          this.map.removeLayer(found);
          this.map.addLayer(layer);
        }
      }
  }

  public addVectorLayers() {
      Array.from(this.mapState.getVectorLayers().values()).forEach(layer => {
      this.map.addLayer(layer);
    });
  }


  public addVectorLayer(name: string) {
    const layer = this.mapState.getBaseLayers().get(name);
    if (layer) {
      this.map.addLayer(layer);
    }
  }

  public createVectorLayers(features: HzxFeature[]): void {
    features.forEach((feature) => this.createVectorLayer(feature));
  }
    
  private createVectorLayer(feature: HzxFeature): void {
    const vectorSource = new VectorSource({
      features: [feature.feature]
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });
    vectorLayer.set('id', feature.metadata.id);
    vectorLayer.set('name', feature.metadata.name);
    vectorLayer.set('color', feature.metadata.color);
    vectorLayer.set('selected', false);
    vectorLayer.setStyle(this.createLayerStyle(vectorLayer));
    this.mapState.upsertVectorLayer(feature.metadata.id, vectorLayer);
  }

  public updateVectorLayer(feature: HzxFeature, selected: boolean): void {
    const vectorSource = new VectorSource({
      features: [feature.feature]
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });
    vectorLayer.set('id', feature.metadata.id);
    vectorLayer.set('name', feature.metadata.name);
    vectorLayer.set('color', feature.metadata.color);
    vectorLayer.set('selected', selected);
    vectorLayer.setStyle(this.createLayerStyle(vectorLayer));
    this.mapState.upsertVectorLayer(feature.metadata.id, vectorLayer);
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


  public toggleLayerSelection(id: string) {
    const layer = this.map.getLayers().getArray().find(layer => layer.get('id') === id);
    if (layer) {
      const newState = !layer.get('selected');
      layer.set('selected', newState);
      layer.changed(); // important
    }
  }

  /** Attach the map to a DOM element */
  public setTarget(target: HTMLElement): void {
    this.map.setTarget(target);
  }

  /** Detach map (important when component is destroyed) */
  public clearTarget(): void {
    this.map.setTarget(undefined);
  }

  /** Access to the raw OpenLayers Map */
  public getMap(): olMap {
    return this.map;
  }

  public setCenterFromLonLat(lon: number, lat: number, zoom?: number): void {
    const view = this.map.getView();
    view.setCenter(fromLonLat([lon, lat]));
    if (zoom !== undefined) {
      view.setZoom(zoom);
    }
  }

  public setCenterFromCoordinate(coordinate: Coordinate, zoom?: number): void {
    const view = this.map.getView();
    view.setCenter(coordinate);
    if (zoom !== undefined) {
      view.setZoom(zoom);
    }
  }

  public fitGeom(geom: string): void {
    const wktFormat = new WKT();
    const feature = wktFormat.readFeature(geom, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    const geometry = feature.getGeometry();
    let extent = createEmpty();
    if (geometry) {
      extend(extent, geometry.getExtent());
      this.map.getView().fit(extent, {
        padding: [40, 40, 40, 40],
        duration: 500,
        maxZoom: 18
      });
    }
  }
  
  public getView(): View {
    return this.currentView;
  }

  public getViewCenter(): string {
    const center = this.currentView.getCenter();
    const stringifyFunc = createStringXY(2);
    const viewCenter = center ? stringifyFunc(center) : "5, 51";
    return `[${viewCenter}]`;
  }

  public getViewZoom(): string {
    const zoom = this.currentView.getZoom();
    return zoom ? `${zoom}` : "10";
  }

  public getScale(): number {
    let scale: number = 1000;
    const resolution = this.map.getView().getResolution();
    const projection = this.map.getView().getProjection();
    const center = this.map.getView().getCenter();
    if (resolution && center) {
      const pointResolution = getPointResolution(
        projection,
        resolution,
        center,
        "m", // Target units: 'm' for meters
      );
      const dpi = 96;
      const inchesPerMeter = 39.37;
      scale = Math.round(pointResolution * dpi * inchesPerMeter);
    }
    return scale;
  }

}
