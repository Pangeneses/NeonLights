import { Component } from '@angular/core';
import { HeaderComponent } from '../../component/headerComponent/header.component';
import { FooterComponent } from '../../component/footerComponent/footer.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'areader-component-reader',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule],
  templateUrl: './areader.component.html',
  styleUrl: './areader.component.scss'
})
export class AReaderComponent {



}