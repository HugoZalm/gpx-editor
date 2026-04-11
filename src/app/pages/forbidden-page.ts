import { Component } from '@angular/core';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8d7da; color: #721c24; font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <div>
        <h1 style="font-size: 3em; margin-bottom: 20px;">403 - Forbidden</h1>
        <p style="font-size: 1.5em;">You have no access to this page.</p>
      </div>
    </div>
  `,
  styles: []
})
export class ForbiddenPage {}
