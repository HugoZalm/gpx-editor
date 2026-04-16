import {
  Component,
  ChangeDetectionStrategy,
  model,
  input,
  computed,
} from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";

@Component({
  selector: "hz-form-file-input",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!hidden()) {
      <div
        class="upload-container"
        [class.disabled]="disabled()"
        [class.invalid]="invalid()"
        (dragover)="onDragOver($event)"
        (drop)="onDrop($event)"
      >
        <input
          #fileInput
          type="file"
          class="file-input"
          [disabled]="disabled()"
          [attr.accept]="accept()"
          [attr.multiple]="multiple() ? '' : null"
          (change)="onFileChange($event)"
          (blur)="touched.set(true)"
        />

        <div class="drop-zone" (click)="fileInput.click()">
          <p>
            Drag & drop files here or
            <span class="browse">browse</span>
          </p>
        </div>

        @if (files().length > 0) {
          <div class="file-list">
            @for (file of files(); track file.name) {
              <div class="file-item">
                @if (isImage(file)) {
                  <img
                    class="preview"
                    [src]="createPreview(file)"
                    alt="preview"
                  />
                }

                <div class="file-info">
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-size">
                    {{ formatSize(file.size) }}
                  </div>
                </div>

                <button
                  type="button"
                  class="remove-btn"
                  (click)="removeFile(file)"
                  [disabled]="disabled()"
                >
                  ✕
                </button>
              </div>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .upload-container {
        border: 2px dashed #ccc;
        border-radius: 8px;
        padding: 16px;
        position: relative;
      }

      .upload-container.invalid {
        border-color: #e74c3c;
      }

      .drop-zone {
        text-align: center;
        cursor: pointer;
        padding: 20px;
        color: #666;
      }

      .browse {
        color: #007bff;
        text-decoration: underline;
      }

      .file-input {
        display: none;
      }

      .file-list {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .file-item {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #f8f8f8;
        padding: 8px;
        border-radius: 6px;
      }

      .preview {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
      }

      .file-info {
        flex: 1;
      }

      .file-name {
        font-size: 14px;
      }

      .file-size {
        font-size: 12px;
        color: #777;
      }

      .remove-btn {
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 16px;
      }
    `,
  ],
})
export class HzFormFileInput implements FormValueControl<File | File[] | null> {
  // Form control value
  value = model<File | File[] | null>(null);

  // Interaction state
  touched = model<boolean>(false);

  // Form signals
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);

  // Config inputs
  multiple = input<boolean>(false);
  accept = input<string>();
  maxFileSize = input<number | null>(null); // bytes

  // Internal files signal
  protected _files = model<File[]>([]);

  files = computed(() => this._files());

  constructor() {
    this.syncValue();
  }

  private syncValue() {
    const files = this._files();

    if (this.multiple()) {
      this.value.set(files);
    } else {
      this.value.set(files[0] ?? null);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.addFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    if (this.disabled()) return;

    const files = Array.from(event.dataTransfer?.files ?? []);
    this.addFiles(files);
  }

  private isValidFile(file: File): boolean {
    const accept = this.accept();

    // If accept is not defined or empty, allow all
    if (!accept || accept.trim() === "") {
      return true;
    }

    const rules = accept
      .split(",")
      .map((r) => r.trim().toLowerCase())
      .filter(Boolean);

    const fileName = file.name.toLowerCase();
    const mime = file.type.toLowerCase();

    return rules.some((rule) => {
      // Extension match (.gpx)
      if (rule.startsWith(".")) {
        return fileName.endsWith(rule);
      }

      // Wildcard mime type (image/*)
      if (rule.endsWith("/*")) {
        const baseType = rule.slice(0, rule.length - 2);
        return mime.startsWith(baseType + "/");
      }

      // Exact mime type (application/gpx+xml)
      return mime === rule;
    });
  }

  private addFiles(newFiles: File[]) {
    // let files = [...this._files()];
    let files = [...this._files()].filter(
      (file) =>
        this.isValidFile(file) &&
        (!this.maxFileSize() || file.size <= this.maxFileSize()!),
    );

    if (!this.multiple()) {
      files = [newFiles[0]];
    } else {
      files = [...files, ...newFiles];
    }

    if (this.maxFileSize()) {
      files = files.filter((f) => f.size <= this.maxFileSize()!);
    }
    
    this._files.set([...files]);
    this.syncValue();
  }

  removeFile(file: File) {
    const files = this._files().filter(f => f !== file);
    this._files.set([...files]);
    this.syncValue();
  }

  isImage(file: File) {
    return file.type.startsWith("image/");
  }

  createPreview(file: File) {
    return URL.createObjectURL(file);
  }

  formatSize(bytes: number) {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }
}
