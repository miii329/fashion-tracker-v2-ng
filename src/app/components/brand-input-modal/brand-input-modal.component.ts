import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditModalBaseComponent } from '../edit-modal-base/edit-modal-base.component';

@Component({
  selector: 'app-brand-input-modal',
  imports: [CommonModule, FormsModule, EditModalBaseComponent],
  templateUrl: './brand-input-modal.component.html',
  styleUrl: './brand-input-modal.component.css',
})
export class BrandInputModalComponent {
  @Input() isOpen = false;
  @Input() brand: {
    name: string;
    category: string;
    description: string;
    url: string;
  } = {
    name: '',
    category: '',
    description: '',
    url: '',
  };

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitBrand = new EventEmitter<{
    name: string;
    category: string;
    description: string;
    url: string;
  }>();

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.brand.name && this.brand.category) {
      this.submitBrand.emit({ ...this.brand });
      this.resetForm();
    }
  }

  resetForm() {
    this.brand = {
      name: '',
      category: '',
      description: '',
      url: '',
    };
  }

  get isValid(): boolean {
    return !!(this.brand.name && this.brand.category);
  }
}
