import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ActionEvent } from './model/action-event';
import { BooleanColumntypeComponent } from './column-types/boolean.columntype';
import { LandColumntypeComponent } from './column-types/land.columntype';
import { IconColumnheadertypeComponent } from './columnheader-types/icon.columnheadertype';
import { VerzondenColumntypeComponent } from './column-types/verzonden.columntype';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

export enum ColumnType {
  DELETED = 'deleted',
  READY = 'ready',
  LAND = 'land',
  FILTER = 'filter',
  VERZONDEN = 'verzonden'
}
export interface Column {
  id: string;
  label: string;
  type?: ColumnType;
  canSort?: Boolean;
  actionDescription?: string;
  element: string;
}

export interface InfoColumn extends Column {
  sort: '' | 'asc' | 'desc';
}
// type ObjectType = User | Facility;

@Component({
    selector: 'hz-data-table',
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatTableModule,
      MatPaginatorModule,
      MatCheckboxModule,
      MatIconModule,
      MatFormFieldModule,
      MatTooltipModule,
      MatInputModule,
      MatSortModule,
      BooleanColumntypeComponent,
      LandColumntypeComponent,
      VerzondenColumntypeComponent,
      IconColumnheadertypeComponent,
      TranslatePipe
    ],
    templateUrl: './data-table.component.html',
    styleUrl: './data-table.component.scss'
})
export class HzDataTableComponent implements OnInit, AfterViewInit {
  @Output() action: EventEmitter<ActionEvent> = new EventEmitter();
  @Input() columns: Column[] = [];
  @Input() showSelection: boolean = false;
  public _dataSource = new MatTableDataSource<any>();
  @Input() set dataSource(source: any[]) {
    this._dataSource.data = source;
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public infoColumns: InfoColumn[] = [];
  public displayedColumns: string[] = [];
  public ColumnType = ColumnType;

  public initialSelection = [];
  public allowMultiSelect = true;
  public selection = new SelectionModel<any>(
    this.allowMultiSelect,
    this.initialSelection
  );

  constructor() {}

  ngOnInit() {
    this.prepareColumns();
    console.log('DATATABLE columns', this.infoColumns);
    console.log('DATATABLE datasource', this._dataSource);
    this.displayedColumns = this.infoColumns.map((column) => column.id);
    if(this.showSelection) {
      this.displayedColumns = this.prepend('select', this.displayedColumns);
    }
    this._dataSource.sortingDataAccessor = (item, property) => {
      const value = this.columns.find((column: Column) => column.id === property)?.element;
      if (value) {
        return item[value];
      } else {
        return '';
      }
      // switch (property) {
      //   case 'fullName':
      //     return item.person.name;
      //   case 'joined':
      //     return new Date(item.person.startDate); // for date sorting
      //   case 'age':
      //     return item.details.yearsOld;
      //   default:
      //     return (item as any)[property];
      // }
    };
  }

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }

  isType(column: Column, type: ColumnType): boolean {
    return column.type ? column.type === type : false;
  }

  getRecord(row: any) {
    this.action.emit({
      type: 'select',
      payload: row
    });
  }

  addItem() {
    this.action.emit({
      type: 'new',
      payload: null
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this._dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this._dataSource.data.forEach((row) => this.selection.select(row));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  private prepend(value: any, array: any[]): any[] {
    var newArray = array.slice();
    newArray.unshift(value);
    return newArray;
  }

  public sortColumn(column: InfoColumn) {
    // if (column.canSort && column.canSort === true) {
    //   if (column.sort === '') {
    //     column.sort = 'asc';
    //   }
    //   else if (column.sort === 'asc') {
    //     column.sort = 'desc';
    //   }
    //   else {
    //     column.sort = '';
    //   }
    //   console.log('SORT', column);
    //   this.sortData(column);
    // }
  }

  private sortData(column: InfoColumn) {
    const id = column.id;
    if (column.sort !== '') {
      this._dataSource.data.sort((a, b) => {
        console.log('SORT HERE');
        if (a[id] !== null && b[id] !== null) {
          const nameA = a[id].toUpperCase(); // ignore upper and lowercase
          const nameB = b[id].name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return column.sort === 'asc' ? -1 : 1;
          }
          if (nameA > nameB) {
            return column.sort === 'asc' ? 1 : -1;
          }
          return 0;
        }
        return 0;
      });
    }
  }

  private prepareColumns() {
    this.columns.forEach((column: Column) => {
      this.infoColumns.push( { ... column, sort: '' } as InfoColumn );
    })
  }
}
