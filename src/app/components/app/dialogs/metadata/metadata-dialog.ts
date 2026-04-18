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
import { HzxMetaData } from '../../../../services/gpx/model/hzxProject';


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
  readonly data = inject<HzxMetaData>(MAT_DIALOG_DATA);

  public error = signal<string>('');
  public success = signal<string>('');
  private trackFormModel = signal<HzxMetaData>(this.data);
  public form: FieldTree<HzxMetaData> | undefined = undefined;

  private injector = inject(Injector);

  ngOnInit() {
    this.success.set('');
    this.error.set('');
    runInInjectionContext(this.injector, () => {
      this.form = this.trackFormModel ? form(this.trackFormModel) : undefined;
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const name = this.form?.id().value() && this.form?.id().value().length > 0 ? this.form?.id().value() : this.data.id
    const result = {
      id: this.data.id,
      name: this.form?.name().value() && this.form?.name().value().length > 0 ? this.form?.name().value() : this.data.name,
      color: this.form?.color().value() && this.form?.color().value().length > 0 ? this.form?.color().value() : this.data.color
    };
    this.dialogRef.close(result);
  }
}
