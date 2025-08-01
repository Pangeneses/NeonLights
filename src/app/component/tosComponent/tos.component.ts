import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-tos',
  imports: [MatIconModule],
  templateUrl: './tos.component.html',
  styleUrl: './tos.component.scss',
})
export class ToSComponent implements OnInit {
  ngOnInit(): void {}

  constructor() {}

  @Output() notify = new EventEmitter<boolean>();

  onClose() {
    this.notify.emit(true);
  }
}
