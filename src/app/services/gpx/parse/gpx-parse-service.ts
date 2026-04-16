import { inject, Injectable } from '@angular/core';
import { GeoJSON, ParsedGPX, parseGPX } from "@we-gold/gpxjs"
import { GpxStateService } from '../state/gpx-state-service';

@Injectable({
  providedIn: 'root',
})
export class GpxParseService {

  gpxState = inject(GpxStateService);

  parse(gpxFile: string): string | undefined {
    const [parsedFile, error] = parseGPX(gpxFile);
    if (error) {
      console.log('Error while parsing GPX file');
      return undefined;
    } else {
      // const file: GeoJSON = parsedFile.toGeoJSON()
      return this.gpxState.storeTrack(parsedFile);
    }
  }

}
