import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private translate = inject(TranslateService);
  // private authService = inject(AuthService);

  constructor() {
    this.translate.addLangs(['en', 'nl']);
    this.translate.setFallbackLang('en');
    this.translate.use('nl');
  }

  async ngOnInit() {}

  async login() {
    // await this.authService.login();
  }

  async logout() {
    // await this.authService.logout();
  }
}
