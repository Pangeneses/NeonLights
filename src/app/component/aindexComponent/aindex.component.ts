import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

import { HeaderComponent } from '../headerComponent/header.component';
import { ANavComponent } from '../anavComponent/anav.component';
import { FooterComponent } from '../footerComponent/footer.component';

@Component({
  selector: 'article-component-aindex',
  imports: [
    HeaderComponent,
    ANavComponent,
    FooterComponent,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    MatIcon],
  templateUrl: './aindex.component.html',
  styleUrl: './aindex.component.scss'
})
export class AIndexComponent {

  selectedDate = new Date();

}