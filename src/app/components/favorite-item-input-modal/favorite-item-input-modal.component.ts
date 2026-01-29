import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditModalBaseComponent } from '../edit-modal-base/edit-modal-base.component';

@Component({
  selector: 'app-favorite-item-input-modal',
  imports: [CommonModule, FormsModule, EditModalBaseComponent],
  templateUrl: './favorite-item-input-modal.component.html',
  styleUrl: './favorite-item-input-modal.component.css',
})
export class FavoriteItemInputModalComponent {
  @Input() isOpen = false;
  @Input() item: {
    itemName: string;
    brandName: string;
    category: string;
    price?: number;
    memo?: string;
    url?: string;
  } = {
    itemName: '',
    brandName: '',
    category: '',
    price: undefined,
    memo: '',
    url: '',
  };

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitItem = new EventEmitter<{
    itemName: string;
    brandName: string;
    category: string;
    price?: number;
    memo?: string;
    url?: string;
  }>();

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.item.itemName && this.item.brandName && this.item.category) {
      this.submitItem.emit({ ...this.item });
      this.resetForm();
    }
  }

  resetForm() {
    this.item = {
      itemName: '',
      brandName: '',
      category: '',
      price: undefined,
      memo: '',
      url: '',
    };
  }

  get isValid(): boolean {
    return !!(this.item.itemName && this.item.brandName && this.item.category);
  }
}
