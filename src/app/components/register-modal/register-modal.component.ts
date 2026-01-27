import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css',
})
export class RegisterModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() registerSubmit = new EventEmitter<{
    fullname: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }>();
  @Output() switchModal = new EventEmitter<void>();

  fullname = '';
  email = '';
  password = '';
  passwordConfirm = '';

  close() {
    this.closeModal.emit();
  }

  switchToLogin(event: Event) {
    event.preventDefault();
    this.switchModal.emit();
  }

  onSubmit() {
    if (this.fullname && this.email && this.password && this.passwordConfirm) {
      this.registerSubmit.emit({
        fullname: this.fullname,
        email: this.email,
        password: this.password,
        passwordConfirm: this.passwordConfirm,
      });
      this.fullname = '';
      this.email = '';
      this.password = '';
      this.passwordConfirm = '';
    }
  }
}
