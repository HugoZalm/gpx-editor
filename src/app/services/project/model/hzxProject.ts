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

export type HzxItem = HzxProject | HzxGpx | HzxTrack | HzxRoute | HzxWaypoint;

export interface ItemInfo { 
  type: string;
  id: string;
  parentId: string | undefined;
  // index: { file: number, item?: number };
  item: HzxItem;
}

export interface SelectedItem {
  type: string;
  id: string;
}
