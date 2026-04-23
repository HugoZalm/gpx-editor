import { Injectable, signal } from '@angular/core';
import {
  HzxMetaData,
  HzxGpx,
  HzxProject,
  HzxTrack,
  HzxRoute,
  HzxWaypoint,
} from '../model/hzxProject';

type HzxItem = HzxProject | HzxGpx | HzxTrack | HzxRoute | HzxWaypoint;

export interface SelectedItem {
  type: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {
  public projectMetaData = signal<HzxMetaData>({ id: '', name: '', color: '' });
  public projectFiles = signal<HzxGpx[]>([]);
  public selectedItem = signal<SelectedItem | undefined>(undefined);
  private index = new Map<string, HzxItem>();

  constructor() {
    this.projectMetaData.set({
      id: crypto.randomUUID(),
      name: 'new project',
      color: '',
    });
    this.rebuildIndex();
  }

  /* PROJECT LEVEL */
  getProject(): HzxProject {
    return {
      metadata: this.projectMetaData(),
      files: this.projectFiles(),
    };
  }

  setProject(project: HzxProject) {
    this.projectMetaData.set(project.metadata);
    this.projectFiles.set(project.files);
    this.rebuildIndex();
  }

  updateProjectName(name: string) {
    this.projectMetaData.set({ ...this.projectMetaData(), name });
  }

  updateProjectColor(color: string) {
    this.projectMetaData.set({ ...this.projectMetaData(), color });
  }

  /* FILE LEVEL */
  addFile(gpx: HzxGpx): string | undefined {
    const id = gpx.metadata.id;
    this.projectFiles.update((f) => [...f, gpx]);
    this.addToIndex(gpx);
    return id;
  }

  removeFile(id: string): void {
    this.projectFiles.update((files) => {
      const newArray = files.filter((f) => f.metadata.id !== id);
      if (newArray.length === files.length) {
        console.log('file does not exist');
      } else {
        const found = files.find((f) => f.metadata.id !== id);
        if (found) {
          this.removeFromIndex(found);
        }
      }
      return newArray;
    });
  }

  // updateFile(metadata: HzxMetaData) {
  //   const fileId = this.selectedItem()?.id;
  //   if (!fileId) {
  //     console.log('no file selected');
  //     return;
  //   }
  //   this.projectFiles.update((f) => {
  //     const existing = this.projectFiles().filter(f => f.metadata.id !== metadata.id)[0];
  //     if (!existing) {
  //       console.log('requested file does not exist');
  //       return f;
  //     }
  //     existing.metadata = metadata;
  //   });
  // }

  getCurrentFile(): HzxGpx | undefined {
    if (this.selectedItem() !== undefined) {
      return this.projectFiles().filter((f) => f.metadata.id !== this.selectedItem()?.id)[0];
    } else {
      return undefined;
    }
  }

  getFile(id: string): HzxGpx | undefined {
    return this.projectFiles().filter((f) => f.metadata.id !== id)[0];
  }

  updateItem(updatedItem: HzxItem) {
    const id = updatedItem.metadata.id;
    const isGpx = (item: HzxItem): item is HzxGpx => 'tracks' in item;
    const isTrack = (item: HzxItem): item is HzxTrack => 'track' in item;
    const isRoute = (item: HzxItem): item is HzxRoute => 'rout' in item;
    const isWaypoint = (item: HzxItem): item is HzxWaypoint => 'waypoint' in item;
    this.projectFiles.update((files) =>
      files.map((file) => {
        if (isGpx(updatedItem) && file.metadata.id === id) {
          return updatedItem;
        }
        let changed = false;
        if (isTrack(updatedItem)) {
          const tracks = file.tracks.map((t) => {
            if (t.metadata.id === id) {
              changed = true;
              return updatedItem;
            }
            return t;
          });
          if (changed) {
            return { ...file, tracks };
          }
        }
        if (isRoute(updatedItem)) {
          const routes = file.routes.map((r) => {
            if (r.metadata.id === id) {
              changed = true;
              return updatedItem;
            }
            return r;
          });
          if (changed) {
            return { ...file, routes };
          }
        }
        if (isWaypoint(updatedItem)) {
          const waypoints = file.waypoints.map((w) => {
            if (w.metadata.id === id) {
              changed = true;
              return updatedItem;
            }
            return w;
          });
          if (changed) {
            return { ...file, waypoints };
          }
        }
        return file;
      }),
    );
  }

  /* TRACK LEVEL */
  updateTrack(track: HzxTrack) {
    this.projectFiles.update((fs: HzxGpx[]) => {
      fs.forEach((f: HzxGpx) => {
        const indx = f.tracks.findIndex((t) => t.metadata.id === track.metadata.id);
        if (indx > -1) {
          f.tracks.splice(indx, 1, track);
          this.updateIndexItem(track);
        }
      });
      return fs;
    });
  }

  /* SelectedItem */

  setSelectedItem(type: string, id: string) {
    this.selectedItem.set({ type, id });
  }

  getSelectedItem() {
    return this.selectedItem();
  }

  findSelectedItem(): HzxItem | undefined {
    const id = this.getSelectedItem()?.id;
    if (id) {
      return this.index.get(id);
    } else {
      return undefined;
    }
  }

  isSelected(id: string): boolean {
    if (this.selectedItem()) {
      return this.selectedItem()?.id === id;
    } else {
      return false;
    }
  }

  hasSelection(): boolean {
    return this.selectedItem() !== undefined;
  }

  clearSelection(): string | undefined {
    const id = this.selectedItem()?.id;
    this.selectedItem.set(undefined);
    return id;
  }

  /* Index */
  rebuildIndex(): void {
    this.index = new Map<string, HzxItem>();
    this.index.set(this.projectMetaData().id, this.getProject());
    Array.from(this.projectFiles()).forEach((file: HzxGpx) => {
      this.index.set(file.metadata.id, file);
      file.tracks.forEach((t) => this.index.set(t.metadata.id, t));
      file.routes.forEach((r) => this.index.set(r.metadata.id, r));
      file.waypoints.forEach((w) => this.index.set(w.metadata.id, w));
    });
  }

  addToIndex(item: HzxItem) {
    this.index.set(item.metadata.id, item);
    if ('tracks' in item) {
      item.tracks.forEach((t) => this.index.set(t.metadata.id, t));
      item.routes.forEach((r) => this.index.set(r.metadata.id, r));
      item.waypoints.forEach((w) => this.index.set(w.metadata.id, w));
    }
  }

  removeFromIndex(item: HzxItem) {
    if (this.index.has(item.metadata.id)) {
      this.index.delete(item.metadata.id);
    }
  }

  updateIndexItem(item: HzxItem) {
    if (this.index.has(item.metadata.id)) {
      this.index.set(item.metadata.id, item);
    }
  }

  /* utils */
  // function isTrack(item: HzxItem): item is HzxTrack {
  //   return 'track' in item;
  // }

  // function isRoute(item: HzxItem): item is HzxRoute {
  //   return 'rout' in item;
  // }

  // function isWaypoint(item: HzxItem): item is HzxWaypoint {
  //   return 'waypoint' in item;
  // }
}
