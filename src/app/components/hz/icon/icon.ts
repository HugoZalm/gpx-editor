import { CommonModule } from '@angular/common';
import { IconDefinition } from './../../../../../node_modules/@fortawesome/fontawesome-common-types/index.d';
import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faCoffee, faFileArrowUp, faPencil, faScissors } from '@fortawesome/free-solid-svg-icons';
import { faUser, faGear, faGears, faTrash, faLink, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faEye, faCircleDot, faCheck, faBarcode, faQrcode, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faRoute, faLocationDot, faMap, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

type IconName1 = 'coffee' | 'user' | 'settings' | 'adminsettings' | 'delete' | 'unlink';
type IconName2 = 'cut' | 'edit' | 'goto' | 'visible' | 'check' | 'code' | 'qr' | 'link' | 'plus';
type IconName3 = 'map' | 'track' | 'poi' | 'import' | 'export';
export type IconName = IconName1 | IconName2 | IconName3;
export type SizeName = 'xs' | 'sm' | 'lg' | '1x' | '2x' | '10x';


@Component({
  selector: 'hz-icon',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './icon.html',
  styleUrl: './icon.scss'
})
export class HzIcon {

  icon = input.required<IconName>();
  size = input<SizeProp>('1x');

  iconMap: Record<IconName, IconDefinition> = {
    coffee: faCoffee,
    user: faUser,
    settings: faGear,
    adminsettings: faGears,
    delete: faTrash,
    cut: faScissors,
    edit: faPencil,
    goto: faCircleDot,
    visible: faEye,
    check: faCheck,
    qr: faQrcode,
    code: faBarcode,
    unlink: faLinkSlash,
    link: faLink,
    plus: faPlus,
    map: faMap,
    track: faRoute,
    poi: faLocationDot,
    import: faFileArrowDown,
    export: faFileArrowUp
  } as const;

  currentIcon = computed(() => {
    return this.iconMap[this.icon()] ?? faCoffee;
  });

}
