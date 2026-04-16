import {
  Component,
  model,
  input,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  effect
} from '@angular/core';

import { FormValueControl } from '@angular/forms/signals';
import type { ValidationError, DisabledReason } from '@angular/forms/signals';

@Component({
  selector: 'hz-form-textarea-input',
  template: `
    @if (!hidden()) {
      <div class="textarea-container">

        @if (label()) {
          <label class="textarea-label">
            {{ label() }}
          </label>
        }

        <textarea
          #textarea
          class="textarea"
          [value]="value()"
          (input)="onInput($event)"
          [rows]="rows()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class.invalid]="invalid()"
          [attr.maxlength]="maxLength() || null"
          [attr.aria-invalid]="invalid()"
          (blur)="touched.set(true)"
        ></textarea>

        @if (showCounter()) {
          <div class="char-counter">
            {{ value().length }} / {{ maxLength() }}
          </div>
        }

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
  styles: [`
    .textarea-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .textarea {
      resize: none;
      padding: 8px;
      font: inherit;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .textarea.invalid {
      border-color: #e53935;
    }

    .textarea-label {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .char-counter {
      text-align: right;
      font-size: 0.75rem;
      color: #777;
    }

    .error {
      color: #e53935;
      font-size: 0.8rem;
    }

    .disabled-reasons {
      font-size: 0.75rem;
      color: #777;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HzFormTextareaInput implements FormValueControl<string> {

  // value
  value = model<string>('');

  // interaction state
  touched = model<boolean>(false);

  // form system inputs
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);

//   errors = input<readonly ValidationError.WithField[]>([]);
//   disabledReasons = input<readonly DisabledReason[]>([]);

  // UI inputs
  label = input<string>('');
  placeholder = input<string>('');
  rows = input<number>(3);
  maxLength = input<number>();
  autoResize = input<boolean>(true);

  textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  showCounter = () => this.maxLength() !== null;

  constructor() {
    effect(() => {
      if (!this.autoResize()) return;

      const el = this.textarea()?.nativeElement;
      if (!el) return;

      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    });
  }

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value.set(value);
  }
}