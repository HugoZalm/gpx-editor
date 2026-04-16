import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-columntype-verzonden',
    imports: [
        MatIconModule
    ],
    template: `
        @if (isVerzonden()) {
            <mat-icon matListItemIcon>{{icon}}</mat-icon>
        }
        @else {
            <mat-icon matListItemIcon></mat-icon>
        }
`
})
export class VerzondenColumntypeComponent {
    private _value: string = '';
    @Input() set value(value: string) {
        this._value = value;
    }
    @Input() icon: string = 'check';

    public isVerzonden(): boolean {
        const datum = new Date(this._value);
        const equals = datum.getTime() > 0;
        const result = this.value != '' && equals;
        return result;
    }
   
}