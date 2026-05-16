import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzDataTableComponent } from './data-table.component';

describe('HzDataTableComponent', () => {
  let component: HzDataTableComponent;
  let fixture: ComponentFixture<HzDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzDataTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HzDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
