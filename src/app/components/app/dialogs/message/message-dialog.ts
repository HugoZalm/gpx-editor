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
import { TranslatePipe } from '@ngx-translate/core';

export interface MessageDialogData {
  message: string,
  actions: { label: string, value: string }[]
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
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
})
export class MessageDialog {
  readonly dialogRef = inject(MatDialogRef<MessageDialog>);
  readonly data = inject<MessageDialogData>(MAT_DIALOG_DATA);
  public message = signal<string>(this.data.message);
  public actions = signal<{ label: string, value: string }[]>(this.data.actions);

  ngOnInit() {}

  cancel(): void {
    this.dialogRef.close();
  }

  output(value: string): void {
    this.dialogRef.close(value);
  }

}
