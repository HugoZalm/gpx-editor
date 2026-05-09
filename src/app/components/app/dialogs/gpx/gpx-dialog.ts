import { HzFormTextInput } from './../../../hz/forms/form-text-input';
import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { TranslatePipe } from '@ngx-translate/core';
import { HzxItem, HzxTrack } from '../../../../services/project/model/hzxProject';
import { GpxBuildService } from '../../../../services/gpx/builder/gpx-build-service';
import { Highlight } from 'ngx-highlightjs';

export interface GpxDialogData {
  item: HzxItem
  type: string
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
    Highlight
  ],
  templateUrl: './gpx-dialog.html',
  styleUrl: './gpx-dialog.scss',
})
export class GpxDialog {
  private gpxBuilder = inject(GpxBuildService);
  readonly dialogRef = inject(MatDialogRef<GpxDialog>);
  readonly data = inject<GpxDialogData>(MAT_DIALOG_DATA);
  public item = signal<HzxItem>(this.data.item);
  public type = signal<string>(this.data.type);

  public gpx = computed(() => {
    if (this.type() === 'gpx') {
      return ''; //this.gpxBuilder.fileToGpx(this.item() as HzxTrack);
    } else if (this.type() === 'track') {
      return this.gpxBuilder.trackToGpx(this.item() as HzxTrack);
    } else {
      return '';
    }
  });

  cancel(): void {
    this.dialogRef.close();
  }

}
