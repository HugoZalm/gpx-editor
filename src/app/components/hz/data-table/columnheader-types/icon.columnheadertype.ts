import { Component, OnInit, AfterViewInit, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-columnheadertype-icon',
    imports: [
        MatIconModule
    ],
    template: `
        <mat-icon matListItemIcon>{{icon}}</mat-icon>
`
})
export class IconColumnheadertypeComponent {
    @Input() icon: string = 'check';
}