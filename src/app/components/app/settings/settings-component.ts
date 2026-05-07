import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateService } from '@ngx-translate/core';
import { versionInfo } from '../../../../environments/version';

@Component({
  selector: 'app-settings-component',
  imports: [MatButtonToggleModule],
  templateUrl: './settings-component.html',
  styleUrl: './settings-component.scss',
})
export class SettingsComponent {

  public version: string = '';
  public buildTime: string = '';

  private translate = inject(TranslateService);

  get languages(): readonly string[] {
    return this.translate.getLangs();
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
  }

  ngOnInit() {
    this.version = versionInfo.version;
    this.buildTime = versionInfo.buildTime;
  }
}
