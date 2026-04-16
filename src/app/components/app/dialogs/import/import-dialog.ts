import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { runInInjectionContext, Injector } from '@angular/core';
import { HzFormFileInput } from '../../../hz/forms/form-file-input';
import { TranslatePipe } from '@ngx-translate/core';

export interface ImportFiles {
  files: File[]
}

export const GPX_EXTENTIONS = '.gpx,application/gpx+xml';
export const JSON_EXTENTIONS = '.geojson';
export const HZX_EXTENTIONS = '.hzx';

@Component({
  selector: 'app-import-admin-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    TranslatePipe,
    TitleCasePipe,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    FormField,
    HzFormFileInput
  ],
  templateUrl: './import-dialog.html',
  styleUrl: './import-dialog.scss',
})
export class ImportDialog {
  readonly dialogRef = inject(MatDialogRef<ImportDialog>);
  readonly data = inject<string>(MAT_DIALOG_DATA);

  public error = signal<string>('');
  public success = signal<string>('');
  private trackFormModel = signal<ImportFiles>({ files: [] });
  public form: FieldTree<ImportFiles> | undefined = undefined;
  public extensions = signal<string | undefined>(undefined);

  private injector = inject(Injector);

  ngOnInit() {
    this.success.set('');
    this.error.set('');
    if (this.data === 'gpx') { this.extensions.set(GPX_EXTENTIONS)}
    if (this.data === 'json') { this.extensions.set(JSON_EXTENTIONS)}
    if (this.data === 'hzx') { this.extensions.set(HZX_EXTENTIONS)}
    runInInjectionContext(this.injector, () => {
      this.form = this.trackFormModel ? form(this.trackFormModel) : undefined;
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  async save(): Promise<void> {
    const files = this.form?.files().value() ?? null;
    if (files) {
      const file = files instanceof File ? files : files[0];
      const content = await file.text();
      this.dialogRef.close(content);
    } else {
      this.error.set('no file loaded');
    }
  }
}
