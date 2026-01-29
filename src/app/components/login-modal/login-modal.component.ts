import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<{
    email: string;
    password: string;
  }>();
  @Output() switchModal = new EventEmitter<void>();

  email = '';
  password = '';

  close() {
    this.closeModal.emit();
  }

  switchToRegister(event: Event) {
    event.preventDefault();
    this.switchModal.emit();
  }

  onSubmit() {
    if (this.email && this.password) {
      this.loginSubmit.emit({ email: this.email, password: this.password });
      this.email = '';
      this.password = '';
    }
  }
}
