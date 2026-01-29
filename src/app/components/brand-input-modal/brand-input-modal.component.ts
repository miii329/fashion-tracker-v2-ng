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

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitBrand = new EventEmitter<{
    name: string;
    category: string;
    description: string;
    url: string;
  }>();

  // カテゴリーのリスト
  readonly CATEGORIES = [
    'ファッション',
    'メイク',
    'アクセサリー',
    'カラコン',
    'その他',
  ];

  // モーダル入力用のオブジェクト（内部で管理）
  brand = {
    name: '',
    category: '',
    description: '',
    url: '',
  };

  // モーダルを閉じる
  close() {
    this.resetForm();
    this.closeModal.emit();
  }

  // 保存処理
  onSubmit() {
    if (this.brand.name && this.brand.category) {
      this.submitBrand.emit({ ...this.brand });
      this.resetForm();
    }
  }

  // フォームをリセット
  resetForm() {
    this.brand = {
      name: '',
      category: '',
      description: '',
      url: '',
    };
  }

  // バリデーション
  get isValid(): boolean {
    return !!(this.brand.name && this.brand.category);
  }
}
