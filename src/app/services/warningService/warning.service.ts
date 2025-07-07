import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  template: `
  <div class="warning">
    <h2 class="warning-title">⚠ Warning</h2>
    <div class="warning-content">
        <p>{{ data.message }}</p>
    </div>
    <button class="warning-actions" (click)="this.onClose()">OK</button>
  </div>`,
  styles: `
  .warning{
    position: relative;
    height: 100%;
    width: 100%;
    background-color: #9683c5;
  }
  .warning-title{
    position: absolute;
    top: 15%;
    height: 20%;
    left: 35%;
    width: 30%;
    display: flex;
    justify-content: center;
    font-size: 22px;
    font-weight: 400;
    color: black;
  }
  .warning-content{
    position: absolute;
    top: 40%;
    height: 20%;
    left: 10%;
    width: 80%;
    display: flex;
    justify-content: center;
    color: black;
  }
  .warning-actions{
    position: absolute;
    top: 65%;
    height: 15%;
    left: 35%;
    width: 30%;
    background-color: #544380;
    color: black;
  }
  `
})
export class WarningDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<WarningDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
    
    onClose() {
        
        this.dialogRef.close('confirmed');

    }

}