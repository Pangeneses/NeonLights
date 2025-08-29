import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-logout',
  imports: [MatIconModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent {

  constructor(private router: Router) {}

  @Output() notify = new EventEmitter<boolean>();

  onReturn() {

    this.notify.emit(true);

  }

  onLogout() {

    this.router.navigate(['/headlines']);

    window.location.reload();

  }

}
