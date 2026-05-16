import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RightMenuComponent } from './right-menu-component';
import { TranslateModule } from '@ngx-translate/core';

describe('RightMenuComponent', () => {
  let component: RightMenuComponent;
  let fixture: ComponentFixture<RightMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightMenuComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RightMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
