import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-legal',
  imports: [MatIconModule],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
})
export class LegalComponent {

  constructor() {}

  @Output() notify = new EventEmitter<boolean>();

  onClose() {

    this.notify.emit(true);

  }
  
}
