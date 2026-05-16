import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BottomPanelComponent } from './bottom-panel-component';
import { TranslateModule } from '@ngx-translate/core';

describe('BottomPanelComponent', () => {
  let component: BottomPanelComponent;
  let fixture: ComponentFixture<BottomPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomPanelComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomPanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
