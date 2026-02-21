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
  faviconLoadError = false;

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

  get faviconPreviewUrl(): string {
    const domain =
      this.extractDomain(this.brand.url) ||
      this.suggestedDomain ||
      this.extractDomain(this.brand.name);
    if (!domain) {
      return '';
    }
    return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}`;
  }

  get suggestedDomain(): string {
    return this.buildDomainCandidateFromName(this.brand.name) || '';
  }

  get showDomainSuggestion(): boolean {
    return !this.brand.url.trim() && !!this.suggestedDomain;
  }

  applySuggestedUrl() {
    if (!this.suggestedDomain) {
      return;
    }
    this.brand.url = `https://${this.suggestedDomain}`;
    this.resetFaviconError();
  }

  handleFaviconError() {
    this.faviconLoadError = true;
  }

  resetFaviconError() {
    this.faviconLoadError = false;
  }

  private extractDomain(input: string): string | null {
    if (!input) {
      return null;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      return null;
    }

    try {
      return new URL(trimmed).hostname;
    } catch {
      try {
        return new URL(`https://${trimmed}`).hostname;
      } catch {
        return (
          trimmed
            .replace(/^https?:\/\//, '')
            .split('/')[0]
            .toLowerCase() || null
        );
      }
    }
  }

  private buildDomainCandidateFromName(name: string): string | null {
    const normalized = name
      .trim()
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/&/g, '')
      .replace(/[^a-z0-9.\s-]/g, '')
      .replace(/[\s-]+/g, '');

    if (!normalized) {
      return null;
    }

    if (normalized.includes('.')) {
      return normalized;
    }

    return `${normalized}.com`;
  }
}
