import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopMenuComponent } from './top-menu-component';
import { TranslateModule } from '@ngx-translate/core';

describe('TopMenuComponent', () => {
  let component: TopMenuComponent;
  let fixture: ComponentFixture<TopMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopMenuComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TopMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
