import { MapStateService } from './map/state/map-state-service';
import { inject, Injectable } from '@angular/core';
import { ProjectService } from './project/project-service';
import { HzxFeature, HzxGpx, HzxItem, HzxMetaData, HzxProject, HzxTrack } from './project/model/hzxProject';
import { UtilsService } from './utils-service';
import { GpxUtilsService } from './gpx/utils/gpx-utils-service';
import { MapService } from './map/map.service';
import { GpxParseService } from './gpx/parser/gpx-parse-service';
import { InteractionStates } from './map/model/interaction-states.enum';
import { SelectEvent } from 'ol/interaction/Select';
import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';
import { Coordinate } from 'ol/coordinate';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialog } from '../components/app/dialogs/message/message-dialog';
import { SelectDialog } from '../components/app/dialogs/select/select-dialog';
import { ProjectStateService } from './project/state/project-state-service';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  readonly dialog = inject(MatDialog);

  private projectService = inject(ProjectService);
  private projectStateService = inject(ProjectStateService);
  private mapService = inject(MapService);
  private mapStateService = inject(MapStateService);
  private gpxParseService = inject(GpxParseService);
  private gpxUtilsService = inject(GpxUtilsService);
  private utilsService = inject(UtilsService);

  /* PROJECT */
  public readonly project = this.projectService.project;

  constructor() {
    this.mapStateService.getSelect().on('select', (event: SelectEvent) => {
      this.onSelect(event);
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

  addTrackToFile(track: HzxTrack, fileId: string, prefix?: string) {
    const name = prefix ? prefix + track.metadata.name : track.metadata.name;
    const newTrack: HzxTrack = {
      metadata: { id: crypto.randomUUID() , name, color: this.utilsService.getRandomColor()},
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
    this.mapService.EditVectorLayerMetadata(metadata);
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
    console.log('CLICKED on feature', feature);
    if (!feature) {
      return;
    }
    if (this.mapStateService.interactionState() === InteractionStates.SPLITTER) {
      this.mapStateService.addSelectedFeature(feature);
      const clickCoord = event.mapBrowserEvent.coordinate;
      this.splitFeature(feature, clickCoord);
    }
    if (this.mapStateService.interactionState() === InteractionStates.COMBINER) {
      this.mapStateService.addSelectedFeature(feature);
    }
  }

  public combineFeatures() {
    const features = this.mapStateService.selectedFeatures();
    const tracks: HzxTrack[] = [];
    features.forEach((f) => {
      const id = f.get('layerid');
      const track = this.projectService.getItemById(id);
      // TODO: VANAF HIER OOK SELECT IN PROJECT ?
      if (track && this.isType('track', track)) {
        tracks.push(track as HzxTrack);
      }
    });
    // TODO: VANAF HIER OOK SELECT IN PROJECT ?
    const dialogRef = this.dialog.open(MessageDialog, { data: { 
      message: 'dialog.continuecombine',
      actions: [
        { label: 'dialog.combine', value: 'combine' },
        { label: 'dialog.combineandremoveoldtracks', value: 'remove-oldtrack' }
      ]
    } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        const newTrack = this.gpxUtilsService.combineTracks(tracks);
        console.log('NEW TRACK', newTrack);
        const title = 'dialog.selectFile';
        let list: { label: string, value: string }[] = [];
        list = this.projectStateService.project().files.map( (file: HzxGpx) => {
          return { label: file.metadata.name, value: file.metadata.id }
        });
        const dialogRef2 = this.dialog.open(SelectDialog, { data: {title, list }});
        dialogRef2.afterClosed().subscribe((result) => {
          if (result !== undefined) {
            console.log('SELECTED', result);
            const fileId = result;
            this.addTrackToFile(newTrack, fileId);
            if (result === 'remove-oldtrack') {
              // this.removeTrackFromFile(id);
            }
          }
        });
      }
    });
  }

  private splitFeature(feature: Feature, coord: Coordinate) {
    const closest = this.getClosestPointOnLine(feature, coord);
    console.log('Closest point on line:', closest);
    const id = feature.get('layerid');
    const track = this.projectService.getItemById(id);
    // TODO: VANAF HIER OOK SELECT IN PROJECT ?
    if (track) {
      const best = this.gpxUtilsService.findClosestTrackPointIndex((track as HzxTrack).track, closest);
      console.log('BEST', best);
      // TODO: show splitpoint on map
      const dialogRef = this.dialog.open(MessageDialog, { data: { 
        message: 'dialog.continuesplitonpoint',
        actions: [
          { label: 'dialog.splitonpoint', value: 'split' },
          { label: 'dialog.splitonpointandremoveoldtrack', value: 'remove-oldtrack' }
        ]
      } });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          const newTracks = this.gpxUtilsService.splitTrackAtPointIndex((track as HzxTrack), best.index);
          console.log('NEW TRACKS', newTracks);
          const parentId = this.projectService.getItemByIdWithParentId(id)?.parentId;
          if (parentId) {
            this.addTrackToFile(newTracks[0], parentId, '[1]: ');
            this.addTrackToFile(newTracks[1], parentId, '[2]: ');
            if (result === 'remove-oldtrack') {
              this.removeTrackFromFile(id);
            }
          }
        }
      });
    }
  }

  private addMoreFeatures() {
    // TODO: slect more features and add to collection
    // on rightclick (or left-menu-button ?) return
  }

  private getClosestPointOnLine(feature: Feature<Geometry>, coordinate: Coordinate): Coordinate {
    // returns closest point ON the line (not necessarily a vertex)
    const geom = feature.getGeometry()!;
    return geom.getClosestPoint(coordinate);
  }

}
