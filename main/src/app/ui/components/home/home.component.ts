import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, MaterialModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'

})
export class HomeComponent {
private htmlElement!: HTMLHtmlElement;

  options = this.settings.getOptions();

  constructor(private settings: CoreService) {
    this.htmlElement = document.querySelector('html')!;
  }
}

