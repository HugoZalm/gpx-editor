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

  splitTrackAtPointIndex(track: HzxTrack, index: number): HzxTrack[] {
    const firstTrack = this.getFirstPartOfTrackAtPointIndex(track, index);
    const secondTrack = this.getSecondPartOfTrackAtPointIndex(track, index);
    return [firstTrack, secondTrack];
  }

  combine2Tracks(track1: HzxTrack, track2: HzxTrack): HzxTrack {
    const newId = crypto.randomUUID();
    // TODO: calculate correct values
    const newTrack: Track = {
      name: newId,
      comment: 'combination of 2 tracks with ID: ' + track1.metadata.id + ' and ' +  track2.metadata.id,
      description: null,
      src: null,
      number: null,
      link: null,
      type: null,
      points: [ ...track1.track.points, ...track2.track.points],
      distance: {
        total: track1.track.distance.cumulative[track1.track.distance.cumulative.length -1] + track2.track.distance.cumulative[track2.track.distance.cumulative.length -1],
        cumulative: [ ...track1.track.distance.cumulative, ...track1.track.distance.cumulative ],
      },
      duration: {
        cumulative: [ ...track1.track.duration.cumulative, ...track1.track.duration.cumulative ],
        movingDuration: 0,
        totalDuration: track1.track.duration.cumulative[track1.track.duration.cumulative.length -1] + track2.track.duration.cumulative[track2.track.duration.cumulative.length -1],        startTime: null,
        endTime: null, // TODO: new Date(track.track.duration.startTime?.getTime() + track.track.duration.cumulative[index + 1])
      },
      elevation: {
        maximum: null, // TODO Math.max(track.track.slopes.slice(0, index + 1)),
        minimum: null,
        positive: null,
        negative: null,
        average: null
      },
      slopes: [ ...track1.track.slopes, ...track2.track.slopes ]
    }
    const track = {
      metadata: { id: newId, name: newId, color: '' },
      track: newTrack
    };
    return track;
  }

  combineTracks(tracks: HzxTrack[]): HzxTrack {
    const newId = crypto.randomUUID();
    // TODO: calculate correct values
    const newTrack: Track = {
      name: newId,
      comment: 'combination of tracks with ID: ' + tracks.map((t) => t.metadata.id).join(','),
      description: null,
      src: null,
      number: null,
      link: null,
      type: null,
      points: tracks.flatMap(t => t.track.points),
      distance: {
        total: this.sumOfLastValues(tracks, ['track','distance','cumulative']),
        cumulative: tracks.flatMap(t => t.track.distance.cumulative),
      },
      duration: {
        cumulative: tracks.flatMap(t => t.track.duration.cumulative),
        movingDuration: 0,
        totalDuration: this.sumOfLastValues(tracks, ['track','duration','cumulative']),
        startTime: null,
        endTime: null,
      },
      elevation: {
        maximum: null,
        minimum: null,
        positive: null,
        negative: null,
        average: null
      },
      slopes: tracks.flatMap(t => t.track.slopes)
    }
    const track = {
      metadata: { id: newId, name: newId, color: '' },
      track: newTrack
    };
    return track;
  }

  private getFirstPartOfTrackAtPointIndex(track: HzxTrack, index: number): HzxTrack {
    const newId = crypto.randomUUID();
    const newTrack: Track = {
      name: newId,
      comment: track.track.comment,
      description: track.track.description,
      src: track.track.src,
      number: track.track.number,
      link: track.track.link,
      type: track.track.type,
      points: track.track.points.slice(0, index + 1),
      distance: {
        total: track.track.distance.cumulative[index + 1],
        cumulative: track.track.distance.cumulative.slice(0, index + 1),
      },
      duration: {
        cumulative: track.track.duration.cumulative.slice(0, index + 1),
        movingDuration: track.track.duration.cumulative[index + 1],
        totalDuration: 0, // TODO
        startTime: track.track.duration.startTime,
        endTime: track.track.duration.endTime, // TODO: new Date(track.track.duration.startTime?.getTime() + track.track.duration.cumulative[index + 1])
      },
      elevation: {
        maximum: null, // TODO Math.max(track.track.slopes.slice(0, index + 1)),
        minimum: null,
        positive: null,
        negative: null,
        average: null
      },
      slopes: track.track.slopes.slice(0, index + 1)
    }
    const firstTrack = {
      metadata: { id: newId, name: newId, color: '' },
      track: newTrack
    };
    return firstTrack;
  }

  private getSecondPartOfTrackAtPointIndex(track: HzxTrack, index: number): HzxTrack {
    const newId = crypto.randomUUID();
    const newTrack: Track = {
      name: newId,
      comment: track.track.comment,
      description: track.track.description,
      src: track.track.src,
      number: track.track.number,
      link: track.track.link,
      type: track.track.type,
      points: track.track.points.slice(index),
      distance: {
        total: track.track.distance.total, // TODO correct: - value of [index -1]
        cumulative: track.track.distance.cumulative.slice(index), // TODO correct: every value - value of [index -1]
      },
      duration: {
        cumulative: track.track.duration.cumulative.slice(index), // TODO correct: every value - value of [index -1]
        movingDuration: 0, // TODO track.track.duration.cumulative[index + 1],
        totalDuration: 0, // TODO
        startTime: track.track.duration.startTime, // TODO
        endTime: track.track.duration.endTime, // TODO: new Date(track.track.duration.startTime?.getTime() + track.track.duration.cumulative[index + 1])
      },
      elevation: {
        maximum: null, // TODO Math.max(track.track.slopes.slice(index + 1)),
        minimum: null, // TODO
        positive: null, // TODO
        negative: null, // TODO
        average: null // TODO
      },
      slopes: track.track.slopes.slice() // TODO correct: every value - value of [index -1]
    }
    const secondTrack = {
      metadata: { id: newId, name: newId, color: '' },
      track: newTrack
    };
    return secondTrack;
  }

  private distance(a: Coordinate, b: Coordinate): number {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  private combine(a: any[], b: any): any {
    return [ ...a, ...b ];
  }

  private sumOfLastValues(arr: any[], path: string[]): number {
    return arr.reduce((total, obj) => {
      // Resolve nested property from path
      const value = path.reduce((current, key) => current?.[key], obj);
      // Skip if not an array or empty
      if (!Array.isArray(value) || value.length === 0) {
        return total;
      }
      return total + value[value.length - 1];
    }, 0);
  }
}
