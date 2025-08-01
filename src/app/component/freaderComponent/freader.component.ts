import { Component } from '@angular/core';
import { HeaderComponent } from '../headerComponent/header.component';
import { FooterComponent } from '../footerComponent/footer.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'forum-component-freader',
  imports: [HeaderComponent, FooterComponent, RouterLink, RouterLinkActive, MatIcon],
  templateUrl: './freader.component.html',
  styleUrl: './freader.component.scss',
})
export class FReaderComponent {}
