import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  NAMES = [
    'Fjord', 'Klif', 'Mica', 'Sintel', 'Kwarts', 'Leisteen', 'Echo', 'Duin', 'Varen', 'Klimop',
    'Esdoorn', 'Moss', 'Rozenbottel', 'Wilg', 'Distel', 'Mist', 'Storm', 'Vloed', 'Golf', 'Nevel',
    'Stormvogel', 'Zeelicht', 'Sleutel', 'Slot', 'Knoop', 'Boek', 'Scherven', 'Pijl', 'Vaandel',
    'Droom', 'Gedachte', 'Waarheid', 'Lot', 'Schim', 'Zin', 'Wens'
  ];
  ADJECTIVES = [
    'Schimmige', 'IJdele', 'Dwalende', 'Stille', 'Schemerige', 'Vreemde', 'IJzeren', 'Stalen', 'Vurige',
    'Felle', 'Razende', 'Wilde', 'Grimmige', 'Eeuwige', 'Korte', 'Snellle', 'Vrije', 'Lege', 'Grote'
  ];
  COLORS = [
    'black', 'red', 'lime', 'blue', 'fuchsia', 'yellow', 'aqua', 'white',
    'silver', 'maroon', 'green', 'navy', 'purple', 'olive', 'teal', 'gray'
  ];

  getRandomName(): string {
    const name = this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
    const adjective = this.ADJECTIVES[Math.floor(Math.random() * this.ADJECTIVES.length)];
    return adjective + name;
  }

  getRandomColor(): string {
    return this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
  }

  compareArrays<T>(arr1: T[], arr2: T[]) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    return {
      missing: arr1.filter(x => !set2.has(x)),
      extra: arr2.filter(x => !set1.has(x)),
      common: arr1.filter(x => set2.has(x)),
    };
  }

}
