import { Injectable } from '@angular/core';
import {EventInterface, SportsLib} from '@sports-alliance/sports-lib';
import {DOMParser} from '@xmldom/xmldom'

@Injectable({
  providedIn: 'root',
})
export class GpxConverterService {

  toJson(gpxString: string) {
    SportsLib.importFromGPX(gpxString, DOMParser).then((event: EventInterface) => {
      console.log('GPX', event);
      const distance = event.getDistance();
      const duration = event.getDuration();
    });
  }

  toGpx(item: any) {}
}
