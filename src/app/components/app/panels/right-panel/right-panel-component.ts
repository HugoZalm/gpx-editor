import { CommonModule } from '@angular/common';
import { FileInfo, GpxStateService } from './../../../../services/gpx/state/gpx-state-service';
import { Component, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MetaData, Route, Track, Waypoint } from '@we-gold/gpxjs';

export interface ProjectFile {
  id: string;
  name: string,
  color: string,
  metadata: MetaData,
  tracks: Track[],
  routes: Route[],
  waypoints: Waypoint[]

}

export interface TrackFile {
  id: string;
  name: string,
  color: string,
  tracks: Track[],
}


@Component({
  selector: 'app-right-panel',
  imports: [
    CommonModule,
    MatListModule
  ],
  templateUrl: './right-panel-component.html',
  styleUrl: './right-panel-component.scss',
})
export class RightPanelComponent {
  gpxState = inject(GpxStateService);
  // public projectId = this.gpxState.projectId;
  public projectMetadata = this.gpxState.projectMetaData;
  public projectFiles = computed(() => {
    const files = Array.from(this.gpxState.projectFiles().values()).map(
      (gpx) => {
        return {
          id: gpx.metadata.id,
          name: gpx.file.metadata.name,
          color: gpx.metadata.color,
          metadata: gpx.file.metadata,
          tracks: gpx.file.tracks,
          routes: gpx.file.routes,
          waypoints: gpx.file.waypoints
        } as ProjectFile;
      }
    );
    console.log('FILES', files);
    return files;
  });

  changeProjectName() {
    this.gpxState.updateProjectName('TEST');
  }

  selectFile(file: ProjectFile): void {
    this.gpxState.setCurrentFile(file.id);
  }

  isCurrentFile(file: ProjectFile): boolean {
    return this.gpxState.isCurrentFile(file.id);
  }
}
