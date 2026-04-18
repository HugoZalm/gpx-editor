import { inject, Injectable } from '@angular/core';
import { GeoJSON, ParsedGPX, parseGPX, Point, Track } from '@we-gold/gpxjs';
import { GpxStateService } from '../state/gpx-state-service';
import { HzxFeature, HzxGpx, HzxMetaData, HzxTrack } from '../model/hzxProject';
import Feature from 'ol/Feature';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat } from 'ol/proj';
import { LineString } from 'ol/geom';

@Injectable({
  providedIn: 'root',
})
export class GpxUtilsService {

  gettracksAsFeatures(gpx: HzxGpx): HzxFeature[] {
    const map: HzxFeature[] = [];
    gpx.tracks.forEach((track) => {
      // const points = track.track.points.map((p) => [p.latitude, p.longitude]);
      // const coordinates: Coordinate[] = points.map(([lat, lon]) => fromLonLat([lon, lat]));
      // const feature = new Feature({ geometry: new LineString(coordinates) });
      // const metadata = track.metadata;
      // const id = track.metadata.id;
      // map.push({ metadata, feature });
      const feature = this.gettrackAsFeature(track);
      map.push(feature);
    });
    return map;
  }

  gettrackAsFeature(track: HzxTrack): HzxFeature {
    const points = track.track.points.map((p) => [p.latitude, p.longitude]);
    const coordinates: Coordinate[] = points.map(([lat, lon]) => fromLonLat([lon, lat]));
    const feature = new Feature({ geometry: new LineString(coordinates) });
    const metadata = track.metadata;
    const id = track.metadata.id;
    return { metadata, feature };
  }


}
