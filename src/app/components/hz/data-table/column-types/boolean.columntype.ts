import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-columntype-boolean',
    imports: [
        MatIconModule
    ],
    template: `
        @if (isTrue(_value)) {
            <mat-icon matListItemIcon>{{icon}}</mat-icon>
        }
        @else {
            <mat-icon matListItemIcon></mat-icon>
        }
`
})
export class BooleanColumntypeComponent {
    public _value: boolean | string = false;
    @Input() set value(value: boolean | string) {
        this._value = value;
    }
    @Input() icon: string = 'check';

    isTrue(value: boolean | string): boolean {
        return ((this._value === true) || (this._value === 'true'));
    }
    
}