import { inject, Injectable } from '@angular/core';
import { GeoJSON, ParsedGPX, parseGPX, Point, Route, Track, Waypoint } from '@we-gold/gpxjs';
import { GpxStateService } from '../state/gpx-state-service';
import { HzxGpx, HzxMetaData, HzxRoute, HzxTrack, HzxWaypoint } from '../model/hzxProject';

@Injectable({
  providedIn: 'root',
})
export class GpxParseService {
  gpxState = inject(GpxStateService);

  NAMES = [
    'Fjord', 'Klif', 'Mica', 'Sintel', 'Kwarts', 'Leisteen', 'Echo', 'Duin', 'Varen', 'Klimop',
    'Esdoorn', 'Moss', 'Rozenbottel', 'Wilg', 'Distel', 'Mist', 'Storm', 'Vloed', 'Golf', 'Nevel',
    'Stormvogel', 'Zeelicht', 'Sleutel', 'Slot', 'Knoop', 'Boek', 'Scherven', 'Pijl', 'Vaandel',
    'Droom', 'Gedachte', 'Waarheid', 'Lot', 'Schim', 'Zin', 'Wens'
  ];
  ADJECTIVES = [
    'Schimmige', 'IJdele', 'Dwalende', 'Stille', 'Schemerige', 'Vreemde', 'IJzeren', 'Stalen', 'Vurige',
    'Felle', 'Razende', 'Wilde', 'Grimmige', 'Eeuwige', 'Korte', 'Snellle', 'Vrije', 'Lege', 'Grote'
  ];
  COLORS = [
    'black', 'red', 'lime', 'blue', 'fuchsia', 'yellow', 'aqua', 'white',
    'silver', 'maroon', 'green', 'navy', 'purple', 'olive', 'teal', 'gray'
  ];

  parse(gpxFile: string): HzxGpx | undefined {
    const [parsedFile, error] = parseGPX(gpxFile);
    if (error) {
      console.log('Error while parsing GPX file');
      return undefined;
    }
    return this.parseProject(parsedFile);
  }

  parseProject(file: ParsedGPX): HzxGpx | undefined {
    if (file === null) {
      return undefined;
    }
    const name = file.metadata.name ?? this.getRandomName();
    const id = crypto.randomUUID();
    const color = this.getRandomColor();
    const tracks = this.parseTracks(file.tracks);
    const routes = this.parseRoutes(file.routes);
    const waypoints = this.parseWaypoints(file.waypoints);
    const metadata: HzxMetaData = { id, name, color };
    const gpx: HzxGpx = { metadata, raw: file, tracks, routes, waypoints };
    return gpx;
  }

  private parseTracks(tracks: Track[]): HzxTrack[] {
    const map: HzxTrack[] = [];
    tracks.forEach((track: Track) => {
      const name = track.name ?? this.getRandomName();
      const id = crypto.randomUUID();
      const color = this.getRandomColor();
      const metadata = { id, name, color };
      map.push({ metadata, track });
    });
    return map;
  }

  private parseRoutes(routes: Route[]): HzxRoute[] {
    return [] as HzxRoute[];
  }

  private parseWaypoints(waypoints: Waypoint[]): HzxWaypoint[] {
    return [] as HzxWaypoint[];
  }

  /* UTILS */
  getRandomName(): string {
    const name = this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
    const adjective = this.ADJECTIVES[Math.floor(Math.random() * this.ADJECTIVES.length)];
    return adjective + name;
  }

  getRandomColor(): string {
    return this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
  }

}
