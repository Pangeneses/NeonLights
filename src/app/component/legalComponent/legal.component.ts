import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-legal',
  imports: [MatIconModule],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss'
})
export class LegalComponent implements OnInit {

  ngOnInit(): void {
    
  }
    
  constructor() {}

  @Output() notify = new EventEmitter<boolean>();

  onClose() {

    this.notify.emit(true);

  }
  
}