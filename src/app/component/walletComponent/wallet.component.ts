import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-wallet',
  imports: [MatIconModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
})
export class WalletComponent implements OnInit {
  ngOnInit(): void {}

  constructor() {}

  @Output() notify = new EventEmitter<void>();

  onClose() {
    this.notify.emit();
  }
}
