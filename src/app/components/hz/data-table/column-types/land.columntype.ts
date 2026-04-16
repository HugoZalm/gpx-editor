import { Component, Input } from "@angular/core";
// import { ApiLandenService } from "../../../services/api/landen.service";

@Component({
    selector: 'app-columntype-land',
    imports: [
    ],
    template: `
        {{getLand(_value)}}
    `
})
export class LandColumntypeComponent {
    public _value: number = 0;
    @Input() set value(value: number) {
        this._value = value;
    }

    constructor(
        // private landenService: ApiLandenService
    ) {}
    
    
    getLand(id: number): string {
        let iso2 = '';
        const land = { iso2: '' }; // this.landenService.getById(id);
        if (land) {
            iso2 = land.iso2;
        }
        return iso2;
    }
    
}