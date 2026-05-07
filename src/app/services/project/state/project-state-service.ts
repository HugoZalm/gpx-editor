import { GpxUtilsService } from './../../gpx/utils/gpx-utils-service';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import {
  HzxMetaData,
  HzxGpx,
  HzxProject,
  HzxTrack,
  HzxRoute,
  HzxWaypoint,
  HzxItem,
  ItemInfo
} from '../model/hzxProject';


@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {
  private _project = signal<HzxProject>({ metadata: { id: '', name: '', color: '' }, files: [] });
  public readonly project = this._project.asReadonly();
  private _selectedItemId = signal<string | undefined>(undefined);
  public readonly selectedItemId = this._selectedItemId.asReadonly();

  constructor() {
    this.setProject({ 
      metadata: {
        id: crypto.randomUUID(),
        name: 'new project',
        color: '',
      },
      files: []
    });
  }

  /* SELCTED ITEM */
  setSelectedItemId(id: string | undefined): void {
    this._selectedItemId.set(id);
  }

  /* PROJECT LEVEL */
  setProject(project: HzxProject) {
    this._project.set(project);
  }

  /* FILE LEVEL */
  addFile(gpx: HzxGpx): string {
    const id = gpx.metadata.id;
    this._project.update((project) => ({
      ...project,
      files: [...project.files, gpx],
    }));
    return id;
  }

  removeFile(id: string): void {
    this._project.update((project) => {
      const files = project.files;
      const newFiles = files.filter((f) => f.metadata.id !== id);
      if (newFiles.length === files.length) {
        console.log('file does not exist');
        return project; // no change
      }
      const removed = files.find((f) => f.metadata.id === id);
      if (removed) {
      }
      return {
        ...project,
        files: newFiles,
      };
    });
  }

  updateFile(gpx: HzxGpx): void {
    this._project.update((project) => {
      const files = project.files.map((file) => {
        if (file.metadata.id === gpx.metadata.id) {
          return gpx;
        }
        return file;
      });
      return { ...project, files };
    });
  }

  /* TRACK LEVEL */
  addTrack(fileId: string, track: HzxTrack): void {
    this._project.update((project) => {
      const files = project.files.map((file) => {
        if (file.metadata.id === fileId) {
          file.tracks.push(track);
        }
        return file;
      });
      return { ...project, files };
    });
  }

  removeTrack(trackId: string, parentId: string): void {
    // const parentId = this.getItemByIdWithParentId(trackId)?.parentId;
    if (parentId) {
      this._project.update((project) => {
        const files = project.files.map((file) => {
          if (file.metadata.id === parentId) {
            const idx = file.tracks.findIndex(t => t.metadata.id === trackId);
            if (idx > -1) {
              file.tracks.splice(idx, 1);
            }
          }
          return file;
        });
        return { ...project, files };
      });
    }
  }

  updateTrack(track: HzxTrack, parentId: string): void {
    const trackId = track.metadata.id;
    // const parentId = this.getItemByIdWithParentId(trackId)?.parentId;
    if (parentId) {
      this._project.update((project) => {
        const files = project.files.map((file) => {
          if (file.metadata.id === parentId) {
            const idx = file.tracks.findIndex(t => t.metadata.id === trackId);
            if (idx > -1) {
              file.tracks.splice(idx, 1, track);
            }
          }
          return file;
        });
        return { ...project, files };
      });
    }
  }

  /* ROUTE LEVEL */
  addRoute(fileId: string, route: HzxRoute): string {
    return '';
  }

  removeRoute(id: string): void {}

  updateRoute(route: HzxRoute): void {}

  /* WAYPOINT LEVEL */
  addWaypoint(trackId: string, track: HzxWaypoint): string {
    return '';
  }

  removeWaypoint(id: string): void {}

  updateWaypoint(waypoint: HzxWaypoint): void {}

}