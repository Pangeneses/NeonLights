import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-about',
  imports: [MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  ngOnInit(): void {}

  constructor() {}

  @Output() notify = new EventEmitter<boolean>();

  onClose() {
    this.notify.emit(true);
  }
}
