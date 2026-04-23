import { HzFormTextInput } from './../../../hz/forms/form-text-input';
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
import { HzxMetaData } from '../../../../services/project/model/hzxProject';

export interface MetadataDialogData {
  metadata: HzxMetaData;
  edit: string[];
}
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
    HzFormTextInput
  ],
  templateUrl: './metadata-dialog.html',
  styleUrl: './metadata-dialog.scss',
})
export class MetadataDialog {
  readonly dialogRef = inject(MatDialogRef<MetadataDialog>);
  readonly data = inject<MetadataDialogData>(MAT_DIALOG_DATA);
  public edit = signal<string[]>(this.data.edit);

  public error = signal<string>('');
  public success = signal<string>('');
  private trackFormModel = signal<HzxMetaData>(this.data.metadata);
  public form: FieldTree<HzxMetaData> | undefined = undefined;

  private injector = inject(Injector);

  ngOnInit() {
    this.success.set('');
    this.error.set('');
    runInInjectionContext(this.injector, () => {
      this.form = this.trackFormModel ? form(this.trackFormModel) : undefined;
    });
  }

  public shouldEdit(property: string): boolean {
    const found = this.edit().find((item) => item === property);
    return found !== undefined;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const name = this.form?.id().value() && this.form?.id().value().length > 0 ? this.form?.id().value() : this.data.metadata.id
    const result = {
      id: this.data.metadata.id,
      name: this.form?.name().value() && this.form?.name().value().length > 0 ? this.form?.name().value() : this.data.metadata.name,
      color: this.form?.color().value() && this.form?.color().value().length > 0 ? this.form?.color().value() : this.data.metadata.color
    };
    this.dialogRef.close(result);
  }
}
