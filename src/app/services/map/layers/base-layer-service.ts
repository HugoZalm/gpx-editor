import { inject, Injectable } from '@angular/core';
import { MapStateService } from '../state/map-state-service';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

@Injectable({
  providedIn: 'root',
})
export class BaseLayerService {

  private mapState = inject(MapStateService);

  public createOsmLayer(): void {
    const osm = new TileLayer({
      source: new OSM(),
    });
    this.mapState.upsertBaseLayer('osm', osm);
    this.mapState.getMap().addLayer(osm);
  }

  public createOpenTopoLayer(): void {
    const opentopo = new TileLayer({
      source: new XYZ({
        url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attributions:
          "© OpenStreetMap contributors, SRTM | © OpenTopoMap (CC-BY-SA)",
      }),
    });
    this.mapState.upsertBaseLayer('opentopo', opentopo);
    this.mapState.getMap().addLayer(opentopo);
  }

}
