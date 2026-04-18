import { Route } from '@angular/router';
import { ParsedGPX, Track, Waypoint } from '@we-gold/gpxjs';
import Feature from 'ol/Feature';

export interface HzxProject {
  metadata: HzxMetaData;
  files: HzxGpx[];
}

export interface HzxGpx {
  metadata: HzxMetaData;
  raw: ParsedGPX;
  tracks: HzxTrack[];
  routes: HzxRoute[];
  waypoints: HzxWaypoint[];
}

export interface HzxTrack {
  metadata: HzxMetaData;
  track: Track;
}

export interface HzxRoute {
  metadata: HzxMetaData;
  rout: Route;
}

export interface HzxWaypoint {
  metadata: HzxMetaData;
  waypoint: Waypoint;
}

export interface HzxMetaData {
  id: string;
  name: string;
  color: string;
}

export interface HzxFeature {
  metadata: HzxMetaData;
  feature: Feature;
}