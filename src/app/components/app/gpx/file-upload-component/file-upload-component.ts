import { Component, inject, Injector, runInInjectionContext, signal } from '@angular/core';
import { HzFormFileInput } from '../../../hz/forms/form-file-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FieldTree, form, FormField } from '@angular/forms/signals';

export interface ImportFiles {
  files: File[]
}

@Component({
  selector: 'app-file-upload-component',
  imports: [
    HzFormFileInput,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    FormField,
  ],
  templateUrl: './file-upload-component.html',
  styleUrl: './file-upload-component.scss',
})
export class FileUploadComponent {
  private trackFormModel = signal<ImportFiles>({ files: [] });
  public form: FieldTree<ImportFiles> | undefined = undefined;

  private injector = inject(Injector);

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.form = this.trackFormModel ? form(this.trackFormModel) : undefined;
    });
  }
}
