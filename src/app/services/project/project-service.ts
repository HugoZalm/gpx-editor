import { FileDownloadService } from './../download-service';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { HzxGpx, HzxItem, HzxMetaData, HzxProject, HzxRoute, HzxTrack, HzxWaypoint, ItemInfo } from './model/hzxProject';
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
  private fileDownloadService = inject(FileDownloadService);

  /* PROJECT LEVEL */
  public readonly project = this.projectStateService.project;

  public setProject(project: HzxProject) {
    this.projectStateService.setProject(project);
  }

  public setEmptyProject() {
    const project = { metadata: { id: '', name: '', color: '' }, files: [] };
    this.projectStateService.setProject(project);
  }

  public saveProject() {
    const filename = 'export.hzx';
    const project = this.projectStateService.project();
    this.fileDownloadService.downloadJson(project, filename);
  }

  /* FILE LEVEL */
  addFileToProject(gpx: HzxGpx): string {
    return this.projectStateService.addFile(gpx);
  }

  removeFileFromProject(fileId: string) {
    return this.projectStateService.removeFile(fileId);
  }

  /* TRACK LEVEL */
  getAllTracks(): Map<string, HzxTrack> {
    const tracks: Map<string, HzxTrack> = new Map();
    this.projectStateService.project().files.forEach(file => {
      file.tracks.forEach(track => tracks.set(track.metadata.id, track));
    })
    return tracks;
  }

  getTrackIdsFromFile(fileId: string) {
   const trackIds: string[] = [];
    this.projectStateService.project().files.forEach(file => {
      if (file.metadata.id === fileId) {
        file.tracks.forEach(track => trackIds.push(track.metadata.id));
      }
    })
    return trackIds;
  }

  addNewTrackToFile(fileId: string) {
    const newTrack: HzxTrack = {
      metadata: { id: crypto.randomUUID(), name: 'new track', color: this.utilsService.getRandomColor()},
      track: this.gpxUtilsService.createTrack('new track')
    }
    return this.projectStateService.addTrack(fileId, newTrack);
  }

  addTrackToFile(track: HzxTrack, fileId: string) {
    this.projectStateService.addTrack(fileId, track);
  }

  updateTrack(trackId: string) {
    const parentId = this.getItemByIdWithParentId(trackId)?.parentId;
    if (parentId) {
      this.projectStateService.removeTrack(trackId, parentId);
    }
  } 

  removeTrackFromFile(trackId: string) {
    const parentId = this.getItemByIdWithParentId(trackId)?.parentId;
    if (parentId) {
      this.projectStateService.removeTrack(trackId, parentId);
    }
  }

  /* ROUTE LEVEL */
  getAllRoutes(): Map<string, HzxRoute> {
    const routes: Map<string, HzxRoute> = new Map();
    this.projectStateService.project().files.forEach(file => {
      file.routes.forEach(route => routes.set(route.metadata.id, route));
    })
    return routes;
  }

  /* WAYPOINT LEVEL */
  getAllWaypoints(): Map<string, HzxWaypoint> {
    const waypoints: Map<string, HzxWaypoint> = new Map();
    this.projectStateService.project().files.forEach(file => {
      file.waypoints.forEach(waypoint => waypoints.set(waypoint.metadata.id, waypoint));
    })
    return waypoints;
  }

  /* METADATA */
  editMetadata(metadata: HzxMetaData) {
    const item = this.getItemById(metadata.id);
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
        if (this.isProject(newItem)) {
          this.projectStateService.setProject(newItem as HzxProject);
        } else if (this.isGpx(newItem)) {
          this.projectStateService.updateFile(newItem as HzxGpx);
        } else if (this.isTrack(newItem)) {
          const parentId = this.getItemByIdWithParentId(newItem.metadata.id)?.parentId;
          if (parentId) {
            this.projectStateService.updateTrack(newItem as HzxTrack, parentId);
          }
        } else if (this.isRoute(newItem)) {
          // this.projectStateService.updateRoute(newItem as HzxRoute);
        } else if (this.isWaypoint(newItem)) {
          // this.projectStateService.updateWaypoint(newItem as HzxWaypoint);
        }
      }
    }
  }

  /* SELECTION */
  public readonly selectedItemId = this.projectStateService.selectedItemId;

  isSelected(id: string): boolean {
    const selectionId = this.projectStateService.selectedItemId();
    if (selectionId) {
      return this.projectStateService.selectedItemId() === id;
    } else {
      return false;
    }
  }

  hasSelection(): boolean {
    return this.projectStateService.selectedItemId() !== undefined;
  }


  setSelectedItem(id: string | undefined): void {
    this.projectStateService.setSelectedItemId(id);
  }

  getSelectedItem(): HzxItem | undefined {
    const selectionId = this.projectStateService.selectedItemId();
    if (selectionId) {
      return this.getItemById(selectionId);
    } else {
      return undefined;
    }
  }

  /* Items */
  getItemById(id: string): HzxItem | undefined {
    const project = this.projectStateService.project();
    if (project.metadata.id === id) {
      return project;
    }
    // Check files (GPX)
    for (const file of project.files) {
      if (file.metadata.id === id) return file;
      const track = file.tracks.find(t => t.metadata.id === id);
      if (track) return track;
      const route = file.routes.find(r => r.metadata.id === id);
      if (route) return route;
      const waypoint = file.waypoints.find(w => w.metadata.id === id);
      if (waypoint) return waypoint;
    }
    return undefined;
  }

  getItemByIdWithParentId(id: string): ItemInfo | undefined {
    const project = this.projectStateService.project();
    let parentId = undefined;
    if (project.metadata.id === id) {
      return { type: 'project', id, parentId, item: project };
    }
    for (let fIndex = 0; fIndex < project.files.length; fIndex++) {
      const file = project.files[fIndex];
      parentId = project.metadata.id;
      if (file.metadata.id === id) {
        return { type: 'gpx', id, parentId, item: file };
      }
      parentId = file.metadata.id;
      const tIndex = file.tracks.findIndex(t => t.metadata.id === id);
      if (tIndex !== -1) {
        return { type: 'track', id, parentId, item: file.tracks[tIndex] };
      }
      const rIndex = file.routes.findIndex(r => r.metadata.id === id);
      if (rIndex !== -1) {
        return { type: 'route', id, parentId, item: file.routes[rIndex] };
      }
      const wIndex = file.waypoints.findIndex(w => w.metadata.id === id);
      if (wIndex !== -1) {
        return { type: 'waypoint', id, parentId, item: file.waypoints[wIndex] };
      }
    }
    return undefined;
  }

  /* Utils */
  isType(type: string, item: HzxItem): boolean {
    switch(type) {
      case 'project':
        return  this.isProject(item);
      case 'gpx':
        return this.isGpx(item);
      case 'track':
        return this.isTrack(item);
      case 'route':
        return this.isRoute(item);
      case 'waypoint':
        return this.isWaypoint(item);
    }
    return false;
  }

  public isProject(item: HzxItem): boolean {
    return 'files' in item;
  };
  public isGpx(item: HzxItem): boolean {
    return 'tracks' in item;
  };
  public isTrack(item: HzxItem): boolean {
    return 'track' in item;
  };
  public isRoute(item: HzxItem): boolean {
    return 'route' in item;
  };
  public isWaypoint(item: HzxItem): boolean {
    return 'waypoint' in item;
  };


}
