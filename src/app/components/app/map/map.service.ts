import { effect, inject, Injectable } from "@angular/core";
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
import { Circle, Fill, Stroke, Style } from "ol/style";
import XYZ from "ol/source/XYZ";
import WKT from "ol/format/WKT";
// import { AuthService } from "../../services/auth.service";
// import { ApiService } from "../../services/api.service";
import {createEmpty, extend, Extent, getCenter} from 'ol/extent';
import { ResolutionLike } from "ol/resolution";
import Feature from "ol/Feature";
import { Layer } from "ol/layer";

// define your custom properties
type TrackProperties = {
  typeId?: 'styleId';
};

// // optional: typed feature
// type MyFeature = Feature & {
//   get(key: keyof MyFeatureProps): MyFeatureProps[keyof MyFeatureProps];
// };


@Injectable({
  providedIn: "root",
})
export class MapService {

  private readonly BASETRACKSTYLE = new Style({
          stroke: new Stroke({
            color: "red",
            width: 5,
          }),
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: "red" }),
          }),
        });
  private readonly POISTYLE = new Style({
          stroke: new Stroke({
            color: "red",
            width: 5,
          }),
          image: new Circle({
            radius: 15,
            stroke: new Stroke({
              color: "red",
              width: 3,
            }),
            fill: new Fill({ color: "red" }),
          }),
        });
  private readonly MAPSTYLE = new Style({
          stroke: new Stroke({
            color: "blue",
            width: 5,
          }),
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: "blue" }),
          }),
        });

  

  // private readonly authService = inject(AuthService);
  // private api = inject(ApiService);

  private currentView!: View;
  private map!: olMap;
  private trackStyles: Map<number, Style> = new Map();

  constructor() {
    this.createMap();
    this.createAllLayers();
    this.addListeners();
  }

  private createAllLayers() {
    // this.createOpenTopoLayer();
    this.createOsmLayer();
  }

  private addListeners() {
    this.map.on("moveend", () => this.onMoveEnd());
  }

  private onMoveEnd() {}

  private createMap(): void {
    this.map = new olMap({
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

  private createOsmLayer(): void {
    const osm = new TileLayer({
      source: new OSM(),
    });
    // this.layersMap.set(LayerTypes.OSM, osm);
    this.map.addLayer(osm);
  }

  private createOpenTopoLayer(): void {
    const openTopo = new TileLayer({
      source: new XYZ({
        url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attributions:
          "© OpenStreetMap contributors, SRTM | © OpenTopoMap (CC-BY-SA)",
      }),
    });
    // this.layersMap.set(LayerTypes.OPENTOPO, openTopo);
    this.map.addLayer(openTopo);
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

  
  private getTrackStyle (typeId: number) {
    const color =
      typeId === 1 ? 'red' :
      typeId === 2 ? 'blue' :
      typeId === 3 ? 'green' :
      'gray';

    return new Style({
      // fill: new Fill({ color }),
      stroke: new Stroke({
        color: color,
        width: 3,
      }),
      // image: new CircleStyle({
      //   radius: 6,
      //   fill: new Fill({ color }),
      // }),
    });
  };

}
