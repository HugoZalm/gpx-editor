import { Track, Point } from '@we-gold/gpxjs';
import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import { Coordinate, CoordinateFormat } from 'ol/coordinate';
import { fromLonLat, toLonLat } from 'ol/proj';
import { LineString } from 'ol/geom';
import { HzxGpx, HzxFeature, HzxTrack } from '../../project/model/hzxProject';

@Injectable({
  providedIn: 'root',
})
export class GpxUtilsService {

  createGpx(): string {
    return '<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="HugoZalm" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"><metadata><name>new file</name><time>2026-03-06T11:52:16+01:00</time></metadata></gpx>';
  }

  createTrack(name: string): Track {
    const newTrack: Track = {
      name,
      comment: null,
      description: null,
      src: null,
      number: null,
      link: null,
      type: null,
      points: [],
      slopes: [],
      distance: {
        total: 0,
        cumulative: []
      },
      duration: {
        cumulative: [],
        movingDuration: 0,
        totalDuration: 0,
        startTime: null,
        endTime: null
      },
      elevation: {
        maximum: null,
        minimum: null,
        positive: null,
        negative: null,
        average: null
      }
    };
    return newTrack;
  }

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

  findClosestTrackPointIndex(track: Track, coord: Coordinate): { index: number; distance: number } {
    let best = {
      index: -1,
      distance: Infinity
    };
    track.points.forEach((p, i) => {
      const pp = toLonLat([coord[0], coord[1]]);
      const d = this.distance([p.longitude, p.latitude], pp);
      if (d < best.distance) {
        best = {
          index: i,
          distance: d
        };
      }
    });
    return best;
  }

  distance(a: Coordinate, b: Coordinate): number {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
  }
}
