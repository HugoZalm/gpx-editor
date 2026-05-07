import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

export interface SelectDialogData {
  title: string;
  list: { label: string, value: any }[]
}


@Component({
  selector: 'app-import-admin-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    TranslatePipe,
    TitleCasePipe,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './select-dialog.html',
  styleUrl: './select-dialog.scss'
})
export class SelectDialog {
  readonly dialogRef = inject(MatDialogRef<SelectDialog>);
  readonly data = inject<SelectDialogData>(MAT_DIALOG_DATA);
  public title = signal<string>(this.data.title);
  public list = signal<{ label: string, value: any }[]>(this.data.list);
  public selected = signal<any>('');

  select(event: any) {
    this.selected.set((event.target as HTMLSelectElement).value);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  ok(): void {
    this.dialogRef.close(this.selected());
  }

}
