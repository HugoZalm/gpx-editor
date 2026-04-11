import { Component } from '@angular/core';

@Component({
  selector: 'app-under-construction-page',
  standalone: true,
  template: `
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #fff8e1;
      color: #6d4c41;
    ">
      
      <img src="/assets/under-construction.png" height="50%"/>

      <h1 style="font-size: 2.5em; margin: 0 0 10px;">
        Under Construction
      </h1>

      <p style="font-size: 1.3em; color: #795548;">
        This page is not available at the moment.
      </p>
    </div>
  `,
  styles: []
})
export class UnderConstructionPage {}
