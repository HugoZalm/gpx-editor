import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';
import type {ValidationError, DisabledReason} from '@angular/forms/signals';

@Component({
  selector: 'hz-form-text-input',
  template: `
    @if (!hidden()) {
      <div class="input-container">
        <input
          type="text"
          [value]="value()"
          (input)="value.set($event.target.value)"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class.invalid]="invalid()"
          [attr.aria-invalid]="invalid()"
          (blur)="touched.set(true)"
        />
        <!-- @if (invalid()) {
          <div class="error-messages" role="alert">
            @for (error of errors(); track error) {
              <span class="error">{{ error.message }}</span>
            }
          </div>
        } -->
        <!-- @if (disabled() && disabledReasons().length > 0) {
          <div class="disabled-reasons">
            @for (reason of disabledReasons(); track reason) {
              <span>{{ reason.message }}</span>
            }
          </div>
        } -->
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HzFormTextInput implements FormValueControl<string> {
  // Required
  value = model<string>('');
  // Writable interaction state - control updates these
  touched = model<boolean>(false);
  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  // disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  // errors = input<readonly ValidationError.WithField[]>([]);
}