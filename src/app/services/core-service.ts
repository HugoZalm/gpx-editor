import { GpxConverterService } from './converter/gpx-converter-service';
import { UiStateService } from './ui/ui-state-service';
import { MapStateService } from './map/state/map-state-service';
import { effect, inject, Injectable, signal, Signal } from '@angular/core';
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
import { SelectEvent } from 'ol/interaction/Select';
import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';
import { Coordinate } from 'ol/coordinate';
// import { FileItem, TrackItem } from '../components/app/project/project-component';

@Injectable({
  providedIn: 'root',
})
export class CoreService {

  private projectService = inject(ProjectService);
  private mapService = inject(MapService);
  private mapStateService = inject(MapStateService);
  private uiStateService = inject(UiStateService);
  private gpxParseService = inject(GpxParseService);
  private gpxUtilsService = inject(GpxUtilsService);
  private utilsService = inject(UtilsService);
  private gpxConverterService = inject(GpxConverterService);

  /* PROJECT */
  public readonly project = this.projectService.project;

  constructor() {
    this.mapStateService.getSelect().on('select', (event: SelectEvent) => {
      this.onSelect(event);
    });
    effect(() => {
      // const splitResult = this.mapStateService.splitResult();
      // console.log('Split changed:', splitResult);
      // if (splitResult) {
      //   console.log('Original feature:', splitResult.original);
      //   const fileId = this.projectService.getItemByIdWithParentId(splitResult.original.get('id'));
      //   Array.from(splitResult.features).forEach((feature: any) => {
      //     console.log('feature:', feature);
      //     const layer = this.mapService.createVectorLayer(this.utilsService.createFeature(feature));
      //     // this.gpxUtilsService.createTrack('');
      //     // this.projectService.addTrackToFile()
      //   // TODO add new features to Project
      //   });
      //   this.mapService.removeVectorLayer(splitResult.original.get('id'));
      //   // TODO remove oldFeature from project (if users agrees)
      //   this.mapService.setSplitter(undefined);
      // }
    });
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

  isInteractionState(state: InteractionStates): boolean {
    return this.mapStateService.interactionState() === state;
  }

  setInteractionState(state: InteractionStates): void {
    this.mapService.setInteractionState(state);
  }

  /* UTILS */
  isType(type: string, item: HzxItem) {
    return this.projectService.isType(type, item);
  }

  private onSelect(event: SelectEvent) {
    const feature = event.selected[0];
    if (!feature) {
      this.mapStateService.clearSelection();
      return;
    }
    console.log('CLICKED on feature', feature);
    if (this.mapStateService.interactionState() === InteractionStates.SPLITTER) {
      const clickCoord = event.mapBrowserEvent.coordinate;
      const closest = this.getClosestPointOnLine(feature, clickCoord);
      console.log('Closest point on line:', closest);
      const id = feature.get('id');
      const track = this.projectService.getItemById(id);
      if (track) {
        const best = this.gpxUtilsService.findClosestTrackPointIndex((track as HzxTrack).track, closest);
        console.log('BEST', best);
      }
    }
    // this.mapState.addSelectedFeature(feature);
  }

  private getClosestPointOnLine(feature: Feature<Geometry>, coordinate: Coordinate): Coordinate {
    // returns closest point ON the line (not necessarily a vertex)
    const geom = feature.getGeometry()!;
    return geom.getClosestPoint(coordinate);
  }

}
