import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-settings',
  imports: [MatIconModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  ngOnInit(): void {}

  constructor() {}

  @Output() notify = new EventEmitter<void>();

  onClose() {
    this.notify.emit();
  }
}
