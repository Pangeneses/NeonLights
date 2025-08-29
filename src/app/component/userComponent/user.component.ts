import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { ProfileComponent } from '../profileComponent/profile.component';
import { PurchasesComponent } from '../purchasesComponent/purchases.component';
import { WalletComponent } from '../walletComponent/wallet.component';
import { SettingsComponent } from '../settingsComponent/settings.component';
import { LogoutComponent } from '../logoutComponent/logout.component';
import { ContactComponent } from '../contactComponent/contact.component';

@Component({
  selector: 'app-component-user',
  imports: [
    MatIcon,
    ProfileComponent,
    PurchasesComponent,
    WalletComponent,
    SettingsComponent,
    LogoutComponent,
    ContactComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {

  constructor() {}

  @Output() notify = new EventEmitter<void>();

  isProfilePopUp = false;

  onProfilePopUp(): void {

    this.isProfilePopUp = true;

    this.notify.emit();

  }

  isPurchasesPopUp = false;

  onPurchasesPopUp(): void {

    this.isPurchasesPopUp = true;

    this.notify.emit();

  }

  isWalletPopUp = false;

  onWalletPopUp(): void {

    this.isWalletPopUp = true;

    this.notify.emit();

  }

  isSettingsPopUp = false;

  onSettingsPopUp(): void {

    this.isSettingsPopUp = true;

    this.notify.emit();

  }

  isContactPopUp = false;

  onContactPopUp(): void {

    this.isContactPopUp = true;

    this.notify.emit();

  }

  isLogoutPopUp = false;

  onLogoutPopUp(): void {

    this.isLogoutPopUp = true;

    this.notify.emit();

  }

  onClose(): void {

    this.isProfilePopUp = false;
    this.isPurchasesPopUp = false;
    this.isWalletPopUp = false;
    this.isSettingsPopUp = false;
    this.isContactPopUp = false;
    this.isLogoutPopUp = false;

    this.notify.emit();

  }

}
