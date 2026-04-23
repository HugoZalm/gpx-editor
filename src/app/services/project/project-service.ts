import { inject, Injectable, signal } from '@angular/core';
import { HzxGpx, HzxProject } from './model/hzxProject';
import { GpxParseService } from '../gpx/parser/gpx-parse-service';
import { ProjectStateService } from './state/project-state-service';
import { GpxUtilsService } from '../gpx/utils/gpx-utils-service';
import { MapService } from '../map/map.service';


@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private projectStateService = inject(ProjectStateService);
  private gpxParseService = inject(GpxParseService);
  private gpxUtilsService = inject(GpxUtilsService);
  private mapService = inject(MapService);

  public saveProject() {
    const filename = 'export.hzx';
    const project = this.projectStateService.getProject();
    const json = JSON.stringify(project, null, 2);
    console.log('SAVED DATA', json);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  public importProject(result: any) {
    const gpx = this.gpxParseService.parse(result);
    if (gpx) {
      const id = this.projectStateService.addFile(gpx);
      const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
      this.mapService.createVectorLayers(features);
      this.mapService.addMissingVectorLayers();
      if (id) {
        this.projectStateService.setSelectedItem('gpx', id);
      }
    }
  }

  public importFile(result: any) {
    const project = JSON.parse(result);
    this.projectStateService.setProject(project);
    project.files.forEach((gpx: HzxGpx) => {
      const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
      this.mapService.createVectorLayers(features);
      this.mapService.addMissingVectorLayers();
    });
  }
}
