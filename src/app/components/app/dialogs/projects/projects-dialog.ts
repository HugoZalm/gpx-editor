import { Component, inject } from '@angular/core';
import { Column, HzDataTableComponent } from '../../../hz/data-table/data-table.component';
import { Project } from '../../../../services/gpx/state/gpx-state-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-projects-dialog',
  imports: [
    HzDataTableComponent
  ],
  templateUrl: './projects-dialog.html',
  styleUrl: './projects-dialog.scss',
})
export class ProjectsDialog {
  readonly data = inject<unknown[]>(MAT_DIALOG_DATA);

  public dataSource: Project[] = [];
  public columns: Column[] = [
    {
      id: 'id',
      label: 'ID',
      canSort: true,
      actionDescription: 'sort by id',
      element: 'id'
    },
    {
      id: 'naam',
      label: 'Naam',
      canSort: true,
      actionDescription: 'sort by naam',
      element: 'naam'
    }
  ]

  handleActions(event: any): void {
    console.log('EVENT', event);
  }

}
