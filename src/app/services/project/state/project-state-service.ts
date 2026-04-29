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
import { U } from 'ol/renderer/webgl/FlowLayer';


@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {
  public readonly project = signal<HzxProject>({ metadata: { id: '', name: '', color: '' }, files: [] });
  public selectedItem = signal<string | undefined>(undefined);
  // private index = new Map<string, HzxItem>();

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
  setSelectedItem(id: string | undefined): void {
    this.selectedItem.set(id);
  }

  getSelectedItem(): HzxItem | undefined {
    const id = this.selectedItem();
    if (id) {
      return this.getItemById(id);
    } else {
      return undefined;
    }
  }

  isSelected(id: string): boolean {
    if (this.selectedItem()) {
      return this.selectedItem() === id;
    } else {
      return false;
    }
  }

  hasSelection(): boolean {
    return this.selectedItem() !== undefined;
  }

  // TODO split into 4 functions, this does not work for HzxGpx
  updateItem(updatedItem: HzxItem): void {
    if (this.isProject(updatedItem)) {
      this.setProject(updatedItem as HzxProject);
    } else if (this.isGpx(updatedItem)) {
      this.updateFile(updatedItem as HzxGpx);
    } else if (this.isTrack(updatedItem)) {
      this.updateTrack(updatedItem as HzxTrack);
    } else if (this.isRoute(updatedItem)) {
      this.updateRoute(updatedItem as HzxRoute);
    } else if (this.isWaypoint(updatedItem)) {
      this.updateWaypoint(updatedItem as HzxWaypoint);
    }
  }

  // updateXFile(updatedItem: HzxGpx) {
  //   const id = updatedItem.metadata.id;
  //   // const isGpx = (item: HzxItem): item is HzxGpx => 'tracks' in item;
  //   // const isTrack = (item: HzxItem): item is HzxTrack => 'track' in item;
  //   // const isRoute = (item: HzxItem): item is HzxRoute => 'rout' in item;
  //   // const isWaypoint = (item: HzxItem): item is HzxWaypoint => 'waypoint' in item;

  //   this.project.update((project) => {
  //     const files = project.files.map((file) => {
  //       // Update whole GPX file
  //       if (isGpx(updatedItem) && file.metadata.id === id) {
  //         return updatedItem;
  //       }

  //       let changed = false;

  //       if (isTrack(updatedItem)) {
  //         const tracks = file.tracks.map((t) => {
  //           if (t.metadata.id === id) {
  //             changed = true;
  //             return updatedItem;
  //           }
  //           return t;
  //         });
  //         if (changed) return { ...file, tracks };
  //       }

  //       if (isRoute(updatedItem)) {
  //         const routes = file.routes.map((r) => {
  //           if (r.metadata.id === id) {
  //             changed = true;
  //             return updatedItem;
  //           }
  //           return r;
  //         });
  //         if (changed) return { ...file, routes };
  //       }

  //       if (isWaypoint(updatedItem)) {
  //         const waypoints = file.waypoints.map((w) => {
  //           if (w.metadata.id === id) {
  //             changed = true;
  //             return updatedItem;
  //           }
  //           return w;
  //         });
  //         if (changed) return { ...file, waypoints };
  //       }

  //       return file;
  //     });

  //     return { ...project, files };
  //   });
  // }

  /* PROJECT LEVEL */
  getProjectAsSignal(): Signal<HzxProject> {
    return this.project;
  }

  getProject(): HzxProject {
    return this.project();
  }

  setProject(project: HzxProject) {
    this.project.set(project);
  }


  /* FILE LEVEL */
  addFile(gpx: HzxGpx): string {
    const id = gpx.metadata.id;
    this.project.update((project) => ({
      ...project,
      files: [...project.files, gpx],
    }));
    return id;
  }

  removeFile(id: string): void {
    this.project.update((project) => {
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
    this.project.update((project) => {
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

  getAllTracks(): Map<string, HzxTrack> {
    const tracks: Map<string, HzxTrack> = new Map();
    this.getProject().files.forEach(file => {
      file.tracks.forEach(track => tracks.set(track.metadata.id, track));
    })
    return tracks;
  }

  addTrack(fileId: string, track: HzxTrack): void {
    this.project.update((project) => {
      const files = project.files.map((file) => {
        if (file.metadata.id === fileId) {
          file.tracks.push(track);
        }
        return file;
      });
      return { ...project, files };
    });
  }

  removeTrack(trackId: string): void {
    const parentId = this.getItemByIdWithParentId(trackId)?.parentId;
    if (parentId) {
      this.project.update((project) => {
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

  updateTrack(track: HzxTrack): void {
    const trackId = track.metadata.id;
    const parentId = this.getItemByIdWithParentId(trackId)?.parentId;
    if (parentId) {
      this.project.update((project) => {
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

  getAllRoutes(): Map<string, HzxRoute> {
    const routes: Map<string, HzxRoute> = new Map();
    this.getProject().files.forEach(file => {
      file.routes.forEach(route => routes.set(route.metadata.id, route));
    })
    return routes;
  }

  addRoute(fileId: string, route: HzxRoute): string {
    return '';
  }

  removeRoute(id: string): void {}

  updateRoute(route: HzxRoute): void {}

  /* WAYPOINT LEVEL */

  getAllWaypoints(): Map<string, HzxWaypoint> {
    const waypoints: Map<string, HzxWaypoint> = new Map();
    this.getProject().files.forEach(file => {
      file.waypoints.forEach(waypoint => waypoints.set(waypoint.metadata.id, waypoint));
    })
    return waypoints;
  }

  addWaypoint(trackId: string, track: HzxWaypoint): string {
    return '';
  }

  removeWaypoint(id: string): void {}

  updateWaypoint(waypoint: HzxWaypoint): void {}

  /* Find Items */
  getItemById(id: string): HzxItem | undefined {
    const project = this.project();
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
    const project = this.project();
    for (let fIndex = 0; fIndex < project.files.length; fIndex++) {
      const file = project.files[fIndex];
      const parentId = file.metadata.id;
      if (file.metadata.id === id) {
        return { type: 'gpx', id, parentId: undefined, item: file };
      }
      const tIndex = file.tracks.findIndex(t => t.metadata.id === id);
      if (tIndex !== -1) {
        return { type: 'track', id: id, parentId, item: file.tracks[tIndex] };
      }
      const rIndex = file.routes.findIndex(r => r.metadata.id === id);
      if (rIndex !== -1) {
        return { type: 'route', id: id, parentId, item: file.routes[rIndex] };
      }
      const wIndex = file.waypoints.findIndex(w => w.metadata.id === id);
      if (wIndex !== -1) {
        return { type: 'waypoint', id: id, parentId, item: file.waypoints[wIndex] };
      }
    }
    return undefined;
  }

  public isProject(item: HzxItem): boolean { return 'files' in item };
  public isGpx(item: HzxItem): boolean { return 'tracks' in item };
  public isTrack(item: HzxItem): boolean { return 'track' in item };
  public isRoute(item: HzxItem): boolean { return 'route' in item };
  public isWaypoint(item: HzxItem): boolean { return 'waypoint' in item };


}