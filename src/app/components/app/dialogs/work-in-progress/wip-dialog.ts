import { Component, inject, signal } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-import-admin-dialog',
  imports: [
    MatButtonModule,
    TranslatePipe,
    TitleCasePipe,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  template: `
  <h2 mat-dialog-title>
  {{ 'dialog.workinprogress' | translate | titlecase }}
</h2>

<mat-dialog-content>
  <img src="images/reparatie-fiets-aan-tafel.jpg" width="100%"/>
</mat-dialog-content>

<mat-dialog-actions>
  <button matButton (click)="close()">{{ 'dialog.close' | translate | titlecase }}</button>
</mat-dialog-actions>`
})
export class WipDialog {
  readonly dialogRef = inject(MatDialogRef<WipDialog>);

  close(): void {
    this.dialogRef.close();
  }

}
