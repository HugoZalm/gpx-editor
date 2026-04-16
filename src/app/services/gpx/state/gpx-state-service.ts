import { ParsedGPX } from '@we-gold/gpxjs';
import { Injectable, signal } from '@angular/core';

export interface Project {
  metadata: FileMetaData;
  files: Map<string, FileInfo>;
}

export interface FileInfo {
  metadata: FileMetaData;
  file: ParsedGPX;
}

export interface FileMetaData {
  id: string;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class GpxStateService {

  NAMES = ['apple', 'banana', 'car', 'house', 'tree'];
  COLORS = ['black', 'red', 'green', 'blue', 'yellow', 'orange', 'grey'];

  public projectMetaData = signal<FileMetaData>({ id: crypto.randomUUID(), name: 'undefined', color: ''});
  public projectFiles = signal<Map<string, FileInfo>>(new Map());
  public currentFile = signal<string | undefined>(undefined);

  /* PROJECT LEVEL */
  getProject(): Project {
    return {
      metadata: this.projectMetaData(),
      files: this.projectFiles()
    };
  }

  getProjectAsString(): string {
    const data = {
      metadata: JSON.stringify(this.projectMetaData(), null, 2),
      files: JSON.stringify(Array.from(this.projectFiles().entries()), null, 2)
    };
    return JSON.stringify(data, null, 2);
  }

  setProject(json: string) {
    const data = JSON.parse(json);
    const map = new Map<string, any>(JSON.parse(data.files));
    this.projectMetaData.set(JSON.parse(JSON.parse(data.metadata)));
    this.projectFiles.set(map);
  }

  updateProjectName(name: string) {
    this.projectMetaData.set({...this.projectMetaData(), name });
  }


  /* FILE LEVEL */
  addFile(file: ParsedGPX): string | undefined {
    if (file !== null) {
      const name = file.metadata.name ?? this.getRandomName();
      const id = crypto.randomUUID();
      const color = this.getRandomColor();
      this.projectFiles.update((f) => {
        const newMap = new Map(f);
          const metadata: FileMetaData = { id, name, color };
          newMap.set(id, { file, metadata });
          return newMap;
      });
      return name;
    } else {
      return undefined;
    }
  }

  removeFile(id: string): void {
    if (this.projectFiles().has(id)) {
      this.projectFiles.update((f) => {
        const newMap = new Map(f);
          newMap.delete(id);
          return newMap;
      });
    } else {
      console.log('file does not exist');
    }
  }

  updateFile(metadata: FileMetaData) {
    const fileName = this.currentFile();
    if (!fileName) { 
      console.log('no file selected');
      return;
    }
    this.projectFiles.update((f) => {
      const newMap = new Map(f);
      const existing = newMap.get(fileName);
      if (!existing) {
        console.log('requested file does not exist');
        return f;
      }
      newMap.set(fileName, {
        ...existing,
        metadata: {
          ...existing.metadata,
          color: 'blue'
        }
      });
      return newMap;
    });
  }

  setCurrentFile(id: string){
    if (this.projectFiles().has(id)) {
      this.currentFile.update((c) => c = id);
    } else {
      console.log('file does not exist');
    }
  }

  getCurrentFile(): FileInfo | undefined {
    if ((this.currentFile() !== undefined) && (this.projectFiles().has(this.currentFile() as string))) {
      return this.projectFiles().get(this.currentFile() as string);
    } else {
      return undefined;
    }
  }

  getFile(id: string): FileInfo | undefined {
    if ((this.currentFile() !== undefined) && (this.projectFiles().has(this.currentFile() as string))) {
      return this.projectFiles().get(this.currentFile() as string);
    } else {
      return undefined;
    }
  }

  hasCurrentFile(): boolean {
    return (this.currentFile !== undefined) && (this.projectFiles().has(this.currentFile() as string));
  }

  isCurrentFile(file: string): boolean {
    return this.currentFile() === file;
  }

  /* UTILS */
  getRandomName(): string {
    return this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
  }

  getRandomColor(): string {
    return this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
  }

}
