import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-purchases',
  imports: [MatIconModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit {

  ngOnInit(): void {
    
  }
    
  constructor() {}

  @Output() notify = new EventEmitter<void>();

  onClose() {

    this.notify.emit();

  }

}
