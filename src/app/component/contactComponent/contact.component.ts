import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-contact',
  imports:  [
    MatIconModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  ngOnInit(): void {
    
  }
    
  constructor() {}

  @Output() notify = new EventEmitter<void>();

  onSend() {

    this.notify.emit();

  }

  onDelete() {

    this.notify.emit();

  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onAppendImageOne(): void{
    this.fileInput.nativeElement.click();
  }

  onAppendImageTwo(): void{
    this.fileInput.nativeElement.click();
  }

  onAppendImageThree(): void{
    this.fileInput.nativeElement.click();
  }

  onAppendImageFour(): void{
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    
    const file = (event.target as HTMLInputElement).files?.[0];
  
    if (file) {
      
      const reader = new FileReader();
    
      reader.onload = () => {
        
        //this.avatarUrl = reader.result;
    
      };
      
      reader.readAsDataURL(file);
  
    }

  }

}
