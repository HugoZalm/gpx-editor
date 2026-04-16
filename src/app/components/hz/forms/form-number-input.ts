import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';
import type {ValidationError, DisabledReason} from '@angular/forms/signals';

@Component({
  selector: 'hz-form-number-input',
  template: `
    @if (!hidden()) {
      <div class="input-container">
        <input
          type="number"
          [value]="value()"
          (input)="onInput($event)"
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
export class HzFormNumberInput implements FormValueControl<number> {
  // Required
  value = model<number>(0);
  // Writable interaction state - control updates these
  touched = model<boolean>(false);
  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  // disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  // errors = input<readonly ValidationError.WithField[]>([]);

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = input.valueAsNumber;
    this.value.set(Number.isNaN(val) ? 0 : val);
  }
}