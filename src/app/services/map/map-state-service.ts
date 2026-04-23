import { Injectable, signal } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

@Injectable({
  providedIn: 'root',
})
export class MapStateService {

  vectorLayers = signal<Map<string, VectorLayer>>(new Map());
  baseLayers = signal<Map<string, TileLayer>>(new Map());

  hasSelectInteraction = signal<boolean>(false);

  /* VectorLayers */
  getVectorLayers(): Map<string, VectorLayer> {
    return this.vectorLayers();
  }

  getVectorLayer(name: string): VectorLayer | undefined {
    return this.vectorLayers().get(name);
  }

  upsertVectorLayer(name: string, layer: VectorLayer): void {
    const message = (this.vectorLayers().has(name)) ? 'vectorlayer updated' : 'vectorlayer added';
    this.vectorLayers.update((b) => {
      const newMap = new Map(b);
      newMap.set(name, layer);
      console.info(message);
      return newMap;
    });
  }

  removeVectorLayer(name: string): void {
    if (this.vectorLayers().has(name)) {
      this.vectorLayers.update((b) => {
        const newMap = new Map(b);
          newMap.delete(name);
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

  getBaseLayer(name: string): TileLayer | undefined {
    return this.baseLayers().get(name);
  }

  upsertBaseLayer(name: string, layer: TileLayer): void {
    const message = (this.baseLayers().has(name)) ? 'baselayer updated' : 'baselayer added';
    this.baseLayers.update((b) => {
      const newMap = new Map(b);
      newMap.set(name, layer);
      console.info(message);
      return newMap;
    });
  }

  removeBaseLayer(name: string): void {
    if (this.baseLayers().has(name)) {
      this.baseLayers.update((b) => {
        const newMap = new Map(b);
          newMap.delete(name);
          console.info('baselayer removed');
          return newMap;
      });
    } else {
      console.warn('baselayer does not exist');
    }
  }
}
