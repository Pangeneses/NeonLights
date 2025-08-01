import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-privacy',
  imports: [MatIconModule],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent implements OnInit {
  ngOnInit(): void {}

  constructor() {}

  @Output() notify = new EventEmitter<boolean>();

  onClose() {
    this.notify.emit(true);
  }
}
