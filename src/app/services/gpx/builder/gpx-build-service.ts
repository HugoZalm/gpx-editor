import { Injectable } from '@angular/core';
import { BaseBuilder, buildGPX } from 'gpx-builder';
import { HzxGpx, HzxTrack } from '../../project/model/hzxProject';
import { Metadata, Track, Segment, Point, Person, Link } from 'gpx-builder/dist/builder/BaseBuilder/models';


@Injectable({
  providedIn: 'root',
})
export class GpxBuildService {


  fileToGpx(file: HzxGpx): string {
    const builder = new BaseBuilder();
    const metaData = new Metadata({ 
      author: file.meta.author === null ? undefined : new Person({ 
        email: file.meta.author.email === null ? undefined : file.meta.author.email.domain ?? undefined,
        link: file.meta.author.link === null ? undefined : new Link(
          file.meta.author.link.href ?? '',
          {
            text: file.meta.author.link.text ?? undefined,
            type: file.meta.author.link.type ?? undefined
          }
        ),
        name: file.meta.author.name === null ? undefined : file.meta.author.name})
    });
    builder.setMetadata(metaData);
    const bTracks: Track[] = [];
    file.tracks.forEach((t) => {
      const bTrack = this.convertTrack(t);
      bTracks.push(bTrack);
    })
    builder.setTracks(bTracks);
    return buildGPX(builder.toObject());
  }

  trackToGpx(track: HzxTrack): string {
    const builder = new BaseBuilder();
    const bTrack = this.convertTrack(track);
    builder.setTracks([bTrack]);
    return buildGPX(builder.toObject());
  }

  convertTrack(track: HzxTrack): Track {
    const points = track.track.points.map((p) => new Point(
      p.latitude,
      p.longitude,
      { ele: p.elevation === null ? undefined : p.elevation,
        time: p.time === null ? undefined : p.time,
        // extensions: p.extensions === null ? undefined : p.extensions
      }
    ));
    const bSegment = new Segment(points);
    const bTrack = new Track();
    bTrack.setSegments([bSegment]);
    return bTrack;
  }
}
