import { GpxUtilsService } from './../../gpx/utils/gpx-utils-service';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
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
import { UtilsService } from '../../utils-service';


@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {
  private utils = inject(UtilsService);

  public ERROR = {
    FileDoesNotExist: 'file does not exist'
  }
  
  private _project = signal<HzxProject>({ metadata: { id: '', name: '', color: '' }, files: [] });
  public readonly project = this._project.asReadonly();
  private _selectedItemId = signal<string | undefined>(undefined);
  public readonly selectedItemId = this._selectedItemId.asReadonly();

  constructor() {
    this.setProject({ 
      metadata: {
        id: crypto.randomUUID(),
        name: 'new project',
        color: this.utils.getRandomColor(),
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
        console.log(this.ERROR.FileDoesNotExist);
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
  addRoute(fileId: string, route: HzxRoute): void {
    this._project.update((project) => {
      const files = project.files.map((file) => {
        if (file.metadata.id === fileId) {
          file.routes.push(route);
        }
        return file;
      });
      return { ...project, files };
    });
  }

  removeRoute(routeId: string, parentId: string): void {
    if (parentId) {
      this._project.update((project) => {
        const files = project.files.map((file) => {
          if (file.metadata.id === parentId) {
            const idx = file.routes.findIndex(t => t.metadata.id === routeId);
            if (idx > -1) {
              file.routes.splice(idx, 1);
            }
          }
          return file;
        });
        return { ...project, files };
      });
    }
  }

  updateRoute(route: HzxRoute, parentId: string): void {
    const routeId = route.metadata.id;
    if (parentId) {
      this._project.update((project) => {
        const files = project.files.map((file) => {
          if (file.metadata.id === parentId) {
            const idx = file.routes.findIndex(t => t.metadata.id === routeId);
            if (idx > -1) {
              file.routes.splice(idx, 1, route);
            }
          }
          return file;
        });
        return { ...project, files };
      });
    }
  }

  /* WAYPOINT LEVEL */
  addWaypoint(fileId: string, waypoint: HzxWaypoint): void {
    this._project.update((project) => {
      const files = project.files.map((file) => {
        if (file.metadata.id === fileId) {
          file.waypoints.push(waypoint);
        }
        return file;
      });
      return { ...project, files };
    });
  }

  removeWaypoint(waypointId: string, parentId: string): void {
    if (parentId) {
      this._project.update((project) => {
        const files = project.files.map((file) => {
          if (file.metadata.id === parentId) {
            const idx = file.waypoints.findIndex(t => t.metadata.id === waypointId);
            if (idx > -1) {
              file.waypoints.splice(idx, 1);
            }
          }
          return file;
        });
        return { ...project, files };
      });
    }
  }

  updateWaypoint(waypoint: HzxWaypoint, parentId: string): void {
    const waypointId = waypoint.metadata.id;
    if (parentId) {
      this._project.update((project) => {
        const files = project.files.map((file) => {
          if (file.metadata.id === parentId) {
            const idx = file.waypoints.findIndex(t => t.metadata.id === waypointId);
            if (idx > -1) {
              file.waypoints.splice(idx, 1, waypoint);
            }
          }
          return file;
        });
        return { ...project, files };
      });
    }
  }

}