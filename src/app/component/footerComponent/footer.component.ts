import { Component, OnInit } from '@angular/core';

import { AboutComponent } from '../aboutComponent/about.component';
import { PrivacyComponent } from '../privacyComponent/privacy.component';
import { LegalComponent } from '../legalComponent/legal.component';
import { ToSComponent } from '../tosComponent/tos.component';

@Component({
  selector: 'app-component-footer',
  imports: [
    AboutComponent, 
    ToSComponent, 
    PrivacyComponent, 
    LegalComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {

  isAboutPopUp = false;

  onAboutPopUp(): void {

    this.isAboutPopUp = true;

  }

  isToSPopUp = false;

  onToSPopUp(): void {

    this.isToSPopUp = true;

  }

  isPrivacyPopUp = false;

  onPrivacyPopUp(): void {

    this.isPrivacyPopUp = true;

  }

  isLegalPopUp = false;

  onLegalPopUp(): void {

    this.isLegalPopUp = true;

  }

  onClose(succeed: boolean): void {

    this.isAboutPopUp = false;
    this.isPrivacyPopUp = false;
    this.isLegalPopUp = false;
    this.isToSPopUp = false;

  }
  
}
