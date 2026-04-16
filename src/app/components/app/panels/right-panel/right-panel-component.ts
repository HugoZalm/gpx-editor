import { GpxStateService } from './../../../../services/gpx/state/gpx-state-service';
import { Component, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-right-panel',
  imports: [
    MatListModule
  ],
  templateUrl: './right-panel-component.html',
  styleUrl: './right-panel-component.scss',
})
export class RightPanelComponent {
  gpxState = inject(GpxStateService);
  // public projectId = this.gpxState.projectId;
  public projectName = this.gpxState.projectName;
  public projectFiles = computed(() => {
    const files = Array.from(this.gpxState.projectFiles().values()).map(
      (gpx) => {
        return {
          name: gpx.file.metadata.name,
          color: gpx.config.color,
          metadata: gpx.file.metadata,
          tracks: gpx.file.tracks,
          routes: gpx.file.routes,
          waypoints: gpx.file.routes
        }
      }
    );
    console.log('FILES', files);
    return files;
  });
}
