import { MapStateService } from './map/state/map-state-service';
import { inject, Injectable, Signal } from '@angular/core';
import { ProjectService } from './project/project-service';
import { HzxGpx, HzxItem, HzxMetaData, HzxProject, HzxTrack } from './project/model/hzxProject';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { UtilsService } from './utils-service';
import { GpxUtilsService } from './gpx/utils/gpx-utils-service';
import { MapService } from './map/map.service';
import { GpxParseService } from './gpx/parser/gpx-parse-service';
// import { FileItem, TrackItem } from '../components/app/project/project-component';

@Injectable({
  providedIn: 'root',
})
export class CoreService {

  private projectService = inject(ProjectService);
  private mapService = inject(MapService);
  private gpxParseService = inject(GpxParseService);
  private gpxUtilsService = inject(GpxUtilsService);


  getProject(): Signal<HzxProject> {
    return this.projectService.getProject();
  }
  
  newProject() {
    this.projectService.setEmptyProject();
    this.mapService.removeAllVectorLayers();
  }

  replaceProject(result: string) {
    const project: HzxProject = JSON.parse(result);
    this.projectService.setProject(project);
    this.mapService.removeAllVectorLayers();
    project.files.forEach((gpx: HzxGpx) => {
      const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
      this.mapService.createVectorLayers(features);
    });
  }

  saveProject() {
    this.projectService.saveProject();
  }

  addFileToProject(result?: string) {
    const definedResult = result ? result : this.gpxUtilsService.createGpx();
    const gpx = this.gpxParseService.parse(definedResult);
    if (gpx) {
      this.projectService.addFileToProject(gpx);
      const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
      this.mapService.createVectorLayers(features);
    }
  }

  addNewTrackToFile(fileId: string) {
    this.projectService.addNewTrackToFile(fileId);
  }

  removeTrackFromFile(trackId: string) {
    this.projectService.removeTrackFromFile(trackId);
  }

  moveTrackToFile(fileId: string, trackId: string) {
    // this.projectService.addFile();
    // if (trackId) {
    //   const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
    //   this.mapService.createVectorLayers(features);
    // }
  }

  removeFileFromProject(id: string) {
    // const trackIds = this.projectService.getTrackIdsFromFile(id);
    // this.mapService.removeVectorLayers(trackIds);
    // this.projectService.removeFile(id);
  }

  editMetadata(metadata: HzxMetaData) {
    this.projectService.editMetadata(metadata);
    // this.mapService.EditVectorLayerMetadata(id, metadata);
  }

  isSelected(id: string) {
    return this.projectService.isSelected(id);
  }

  toggleSelection(item?: HzxItem) {
    const currentSelectedItemId = this.projectService.getSelectedItem()?.metadata.id;
    if (currentSelectedItemId) {
      this.mapService.toggleVectorLayerSelection(currentSelectedItemId);
    }
    let id = item?.metadata.id ?? '';
    this.projectService.setSelectedItem(id);
    this.mapService.toggleVectorLayerSelection(id);
  }

  getSelectedItem(): HzxItem | undefined {
    return this.projectService.getSelectedItem();
  }

  isType(type: string, item: HzxItem) {
    return this.projectService.isType(type, item);
  }

}
