import { inject, Injectable, Signal, signal } from '@angular/core';
import { HzxGpx, HzxItem, HzxMetaData, HzxProject, HzxTrack } from './model/hzxProject';
import { ProjectStateService } from './state/project-state-service';
import { UtilsService } from '../utils-service';
import { GpxUtilsService } from '../gpx/utils/gpx-utils-service';


@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private projectStateService = inject(ProjectStateService);
  private gpxUtilsService = inject(GpxUtilsService);
  private utilsService = inject(UtilsService);

  public getProject(): Signal<HzxProject> {
    return this.projectStateService.getProjectAsSignal();
  }

  public setProject(project: HzxProject) {
    this.projectStateService.setProject(project);
  }

  public setEmptyProject() {
    const project = { metadata: { id: '', name: '', color: '' }, files: [] };
    this.projectStateService.setProject(project);
  }

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

  isSelected(id: string) {
    return this.projectStateService.isSelected(id);
  }

  setSelectedItem(id: string | undefined): void {
    this.projectStateService.setSelectedItem(id);
  }

  getSelectedItem(): HzxItem | undefined {
    return this.projectStateService.getSelectedItem();
  }

  getItem(id: string): HzxItem | undefined {
    return this.projectStateService.getItemById(id);
  }

  addFileToProject(gpx: HzxGpx): string {
    return this.projectStateService.addFile(gpx);
  }

  addNewTrackToFile(fileId: string) {
    const newTrack: HzxTrack = {
      metadata: { id: crypto.randomUUID(), name: 'new track', color: this.utilsService.getRandomColor()},
      track: this.gpxUtilsService.createTrack('new track')
    }
    return this.projectStateService.addTrack(fileId, newTrack);
  }

  removeTrackFromFile(trackId: string) {
    this.projectStateService.removeTrack(trackId);
  } 


  editMetadata(metadata: HzxMetaData) {
    const item = this.projectStateService.getItemById(metadata.id);
    if (item) {
      let newItem;
      if (this.isType('project', item)) {
        newItem = { 
          metadata,
          files: (item as HzxProject).files
        } as HzxProject;
      }
      if (this.isType('gpx', item)) {
        newItem = {
          metadata,
          raw: (item as HzxGpx).raw,
          tracks: (item as HzxGpx).tracks,
          routes: (item as HzxGpx).routes,
          waypoints: (item as HzxGpx).waypoints,
        } as HzxGpx;
      }
      if (this.isType('track', item)) {
        newItem = {
          metadata,
          track: (item as HzxTrack).track
        } as HzxTrack;
      }
      if (newItem) {
        this.projectStateService.updateItem(newItem);
      }
    }
  }

  isType(type: string, item: HzxItem): boolean {
    switch(type) {
      case 'project':
        return  this.projectStateService.isProject(item);
      case 'gpx':
        return this.projectStateService.isGpx(item);
      case 'track':
        return this.projectStateService.isTrack(item);
      case 'route':
        return this.projectStateService.isRoute(item);
      case 'waypoint':
        return this.projectStateService.isWaypoint(item);
    }
    return false;
  }

  

  // addItem(item: HzxItem): string {
  //   return this.projectStateService.updateIndexItem(item);
  // }

  // updateItem(item: HzxItem): void {
  //   this.projectStateService.updateItem(item);
  // }

  // removeItem(id: string): void {
  //   this.projectStateService.removeItem(id);
  // }

  // public importProject(result: any) {
  //   const gpx = this.gpxParseService.parse(result);
  //   if (gpx) {
  //     this.coreService.addToProject(gpx);
  //   }
  // }

  // public importFile(result: any) {
  //   const project = JSON.parse(result);
  //   // this.projectStateService.setProject(project);
  //   // project.files.forEach((gpx: HzxGpx) => {
  //   //   const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
  //   //   this.mapService.createVectorLayers(features);
  //   //   this.mapService.addMissingVectorLayers();
  //   // });
  // }
}
