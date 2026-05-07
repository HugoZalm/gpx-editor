import { GpxConverterService } from './converter/gpx-converter-service';
import { UiStateService } from './ui/ui-state-service';
import { MapStateService } from './map/state/map-state-service';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { ProjectService } from './project/project-service';
import { HzxGpx, HzxItem, HzxMetaData, HzxProject, HzxTrack } from './project/model/hzxProject';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { UtilsService } from './utils-service';
import { GpxUtilsService } from './gpx/utils/gpx-utils-service';
import { MapService } from './map/map.service';
import { GpxParseService } from './gpx/parser/gpx-parse-service';
import { InteractionStates } from './map/model/interaction-states.enum';
import { metadata } from '@angular/forms/signals';
// import { FileItem, TrackItem } from '../components/app/project/project-component';

@Injectable({
  providedIn: 'root',
})
export class CoreService {

  private projectService = inject(ProjectService);
  private mapService = inject(MapService);
  private uiStateService = inject(UiStateService);
  private gpxParseService = inject(GpxParseService);
  private gpxUtilsService = inject(GpxUtilsService);
  private utilsService = inject(UtilsService);
  private gpxConverterService = inject(GpxConverterService);

  /* PROJECT */
  public readonly project = this.projectService.project;
  
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

  /* FILE */
  addFileToProject(result?: string) {
    const definedResult = result ? result : this.gpxUtilsService.createGpx();
    const gpx = this.gpxParseService.parse(definedResult);
    if (gpx) {
      this.projectService.addFileToProject(gpx);
      const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
      this.mapService.createVectorLayers(features);
    }
  }

  removeFileFromProject(fileId: string) {
    const trackIds = this.projectService.getTrackIdsFromFile(fileId);
    this.mapService.removeVectorLayers(trackIds);
    this.projectService.removeFileFromProject(fileId);
  }

  /* TRACK */
  addNewTrackToFile(fileId: string) {
    const id = this.projectService.addNewTrackToFile(fileId);
    // this.mapService.createVectorLayer(id);
  }

  removeTrackFromFile(trackId: string) {
    this.projectService.removeTrackFromFile(trackId);
    this.mapService.removeVectorLayer(trackId);
  }

  moveTrackToFile(fileId: string, trackId: string) {
    // TODO
    // this.projectService.addFile();
    // if (trackId) {
    //   const features = this.gpxUtilsService.gettracksAsFeatures(gpx);
    //   this.mapService.createVectorLayers(features);
    // }
  }

  copyTrackToFile(track: HzxTrack, fileId: string) {
    // const id = crypto.randomUUID();
    const newTrack: HzxTrack = {
      metadata: { id: crypto.randomUUID() , name: 'COPY: ' + track.metadata.name, color: this.utilsService.getRandomColor()},
      track: JSON.parse(JSON.stringify(track.track))
    }
    const newTrackId = this.projectService.addTrackToFile(newTrack, fileId);
    if( newTrack && this.isType('track', newTrack)) {
      const feature = this.gpxUtilsService.gettrackAsFeature(newTrack as HzxTrack);
      this.mapService.createVectorLayer(feature);
    }
  }

  /* METADATA */
  editMetadata(metadata: HzxMetaData) {
    this.projectService.editMetadata(metadata);
    // this.mapService.EditVectorLayerMetadata(id, metadata);
  }

  /* SELECTION */
  hasSelection(): boolean {
    return this.projectService.getSelectedItem() !== undefined;
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

  clearSelection(): void {
   const currentSelectedItemId = this.projectService.getSelectedItem()?.metadata.id;
    if (currentSelectedItemId) {
      this.mapService.toggleVectorLayerSelection(currentSelectedItemId);
    }
    this.projectService.setSelectedItem(undefined);
  }

  gotoSelectedItem(item: HzxItem): void {
    if(this.isType('gpx', item)) {
      const trackIds = this.projectService.getTrackIdsFromFile(item.metadata.id);
      this.mapService.gotoSelectedItems(trackIds);
    }
    if(this.isType('track', item)) {
      this.mapService.gotoSelectedItems([item.metadata.id]);
    }
  }

  /* INTERACTIONS */

  public interactionStates = InteractionStates;

  isState(state: InteractionStates): boolean {
    return this.uiStateService.interactionState() === state;
  }

  /* UTILS */
  isType(type: string, item: HzxItem) {
    return this.projectService.isType(type, item);
  }

}
