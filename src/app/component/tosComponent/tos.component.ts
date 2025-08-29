import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-tos',
  imports: [MatIconModule],
  templateUrl: './tos.component.html',
  styleUrl: './tos.component.scss',
})
export class ToSComponent {

  constructor() {}

  @Output() notify = new EventEmitter<boolean>();

  onClose() {

    this.notify.emit(true);

  }
  
}
