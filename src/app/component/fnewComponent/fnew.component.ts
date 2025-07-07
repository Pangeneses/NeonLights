import { Component } from '@angular/core';
import { HeaderComponent } from '../headerComponent/header.component';
import { FooterComponent } from '../footerComponent/footer.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'forum-component-fnew',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule],
  templateUrl: './fnew.component.html',
  styleUrl: './fnew.component.scss'
})
export class FNewComponent {



}