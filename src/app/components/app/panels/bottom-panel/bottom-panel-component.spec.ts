import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomPanelComponent } from './bottom-panel-component';

describe('BottomPanelComponent', () => {
  let component: BottomPanelComponent;
  let fixture: ComponentFixture<BottomPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomPanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
