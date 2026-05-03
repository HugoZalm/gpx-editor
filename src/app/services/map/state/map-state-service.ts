import { Injectable, signal } from '@angular/core';
import Select from 'ol/interaction/Select';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import olMap from "ol/Map";
import View from "ol/View";

@Injectable({
  providedIn: 'root',
})
export class MapStateService {
  private map!: olMap;

  private _vectorLayers = signal<Map<string, VectorLayer>>(new Map());
  public readonly vectorLayers = this._vectorLayers.asReadonly();
  private _baseLayers = signal<Map<string, TileLayer>>(new Map());
  public readonly baseLayers = this._baseLayers.asReadonly();

  hasSelectInteraction = signal<boolean>(false);

  /* Map */
  setMap(map: olMap) {
    this.map = map;
  }

  getMap(): olMap {
    return this.map;
  }

  /* VectorLayers */
  // getVectorLayers(): Map<string, VectorLayer> {
  //   return this._vectorLayers();
  // }

  // getVectorLayer(id: string): VectorLayer | undefined {
  //   return this._vectorLayers().get(id);
  // }

  upsertVectorLayer(id: string, layer: VectorLayer): void {
    const message = (this._vectorLayers().has(id)) ? 'vectorlayer updated' : 'vectorlayer added';
    this._vectorLayers.update((b) => {
      const newMap = new Map(b);
      newMap.set(id, layer);
      console.info(message);
      return newMap;
    });
  }

  removeVectorLayer(id: string): void {
    if (this._vectorLayers().has(id)) {
      this._vectorLayers.update((b) => {
        const newMap = new Map(b);
          newMap.delete(id);
          console.info('vectorlayer removed');
          return newMap;
      });
    } else {
      console.warn('vectorlayer does not exist');
    }
  }

  /* BaseLayers */
  // getBaseLayers(): Map<string, TileLayer> {
  //   return this._baseLayers();
  // }

  // getBaseLayer(id: string): TileLayer | undefined {
  //   return this._baseLayers().get(id);
  // }

  upsertBaseLayer(id: string, layer: TileLayer): void {
    const message = (this._baseLayers().has(id)) ? 'baselayer updated' : 'baselayer added';
    this._baseLayers.update((b) => {
      const newMap = new Map(b);
      newMap.set(id, layer);
      console.info(message);
      return newMap;
    });
  }

  removeBaseLayer(id: string): void {
    if (this._baseLayers().has(id)) {
      this._baseLayers.update((b) => {
        const newMap = new Map(b);
          newMap.delete(id);
          console.info('baselayer removed');
          return newMap;
      });
    } else {
      console.warn('baselayer does not exist');
    }
  }
}
