import { Routes } from '@angular/router';
import { ForbiddenPage } from './pages/forbidden-page';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'forbidden',
    component: ForbiddenPage
  },
  { path: '**', redirectTo: '' },
];
