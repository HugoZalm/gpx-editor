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
import { HzxItem, HzxMetaData } from '../../../../services/project/model/hzxProject';

export interface InfoDialogData {
  item: HzxItem
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
  ],
  templateUrl: './info-dialog.html',
  styleUrl: './info-dialog.scss',
})
export class InfoDialog {
  readonly dialogRef = inject(MatDialogRef<InfoDialog>);
  readonly data = inject<InfoDialogData>(MAT_DIALOG_DATA);
  public item = signal<HzxItem>(this.data.item);

  ngOnInit() {}

  cancel(): void {
    this.dialogRef.close();
  }

}
