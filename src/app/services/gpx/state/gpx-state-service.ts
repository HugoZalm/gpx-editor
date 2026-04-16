import { ParsedGPX } from '@we-gold/gpxjs';
import { Injectable, signal } from '@angular/core';
import { GeoJSON, Track } from '@we-gold/gpxjs';

export interface Project {
  id?: number;
  name: string;
  files: Map<string, GpxInfo>;
}

export interface GpxInfo {
  file: ParsedGPX;
  config: GpxConfig;
}

export interface GpxConfig {
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class GpxStateService {

  NAMES = ['apple', 'banana', 'car', 'house', 'tree'];

  public projectName = signal<string>('test');
  public projectFiles = signal<Map<string, GpxInfo>>(new Map());
  public currentFile = signal<string | undefined>(undefined);

  getProject(): Project {
    return {
      name: this.projectName(),
      files: this.projectFiles()
    };
  }

  getProjectAsString(): string {
    const data = {
      name: this.projectName(),
      files: JSON.stringify(Array.from(this.projectFiles().entries()))
    };
    return JSON.stringify(data, null, 2);
  }

  setProject(json: string) {
    const data = JSON.parse(json);
    const map = new Map<string, any>(JSON.parse(data.files));
    this.projectName.set(data.name);
    this.projectFiles.set(map);
  }

  storeTrack(file: ParsedGPX): string | undefined {
    if (file !== null) {
      const name = file.metadata.name ?? this.getRandomName();
      this.projectFiles.update((f) => {
        const newMap = new Map(f);
          // newMap.set(name, file);
          const config: GpxConfig = { color: 'red' };
          newMap.set(name, { file, config });
          return newMap;
      });
      return name;
    } else {
      return undefined;
    }
  }

  removeTrack(name: string): void {
    if (this.projectFiles().has(name)) {
      this.projectFiles.update((f) => {
        const newMap = new Map(f);
          newMap.delete(name);
          return newMap;
      });
    } else {
      console.log('file does not exist');
    }
  }

  setCurrentFile(name: string){
    if (this.projectFiles().has(name)) {
      this.currentFile.update((c) => c = name);
    } else {
      console.log('file does not exist');
    }
  }

  getCurrentFile(): GpxInfo | undefined {
    if ((this.currentFile() !== undefined) && (this.projectFiles().has(this.currentFile() as string))) {
      return this.projectFiles().get(this.currentFile() as string);
    } else {
      return undefined;
    }
  }

  getFile(name: string): GpxInfo | undefined {
    if ((this.currentFile() !== undefined) && (this.projectFiles().has(this.currentFile() as string))) {
      return this.projectFiles().get(this.currentFile() as string);
    } else {
      return undefined;
    }
  }

  hasCurrentFile(): boolean {
    return (this.currentFile !== undefined) && (this.projectFiles().has(this.currentFile() as string));
  }

  getRandomName(): string {
    return this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
  }

}
