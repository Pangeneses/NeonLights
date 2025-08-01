import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-component-logout',
  imports: [MatIconModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit {
  ngOnInit(): void {}

  constructor(private router: Router) {}

  @Output() notify = new EventEmitter<boolean>();

  onReturn() {
    this.notify.emit(true);
  }

  onLogout() {
    this.router.navigate(['/headlines']);

    localStorage.clear();
    window.location.reload();
  }
}
