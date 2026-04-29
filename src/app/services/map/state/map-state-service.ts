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

  vectorLayers = signal<Map<string, VectorLayer>>(new Map());
  baseLayers = signal<Map<string, TileLayer>>(new Map());

  hasSelectInteraction = signal<boolean>(false);

  /* Map */
  setMap(map: olMap) {
    this.map = map;
  }

  getMap(): olMap {
    return this.map;
  }


  /* VectorLayers */
  getVectorLayers(): Map<string, VectorLayer> {
    return this.vectorLayers();
  }

  getVectorLayer(id: string): VectorLayer | undefined {
    return this.vectorLayers().get(id);
  }

  upsertVectorLayer(id: string, layer: VectorLayer): void {
    const message = (this.vectorLayers().has(id)) ? 'vectorlayer updated' : 'vectorlayer added';
    this.vectorLayers.update((b) => {
      const newMap = new Map(b);
      newMap.set(id, layer);
      console.info(message);
      return newMap;
    });
  }

  removeVectorLayer(id: string): void {
    if (this.vectorLayers().has(id)) {
      this.vectorLayers.update((b) => {
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
  getBaseLayers(): Map<string, TileLayer> {
    return this.baseLayers();
  }

  getBaseLayer(id: string): TileLayer | undefined {
    return this.baseLayers().get(id);
  }

  upsertBaseLayer(id: string, layer: TileLayer): void {
    const message = (this.baseLayers().has(id)) ? 'baselayer updated' : 'baselayer added';
    this.baseLayers.update((b) => {
      const newMap = new Map(b);
      newMap.set(id, layer);
      console.info(message);
      return newMap;
    });
  }

  removeBaseLayer(id: string): void {
    if (this.baseLayers().has(id)) {
      this.baseLayers.update((b) => {
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
