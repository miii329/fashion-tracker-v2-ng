import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditModalBaseComponent } from '../edit-modal-base/edit-modal-base.component';
import { CATEGORIES } from '@/constants/categories';
import { BrandService, Brand } from '@/services/brand.service';

@Component({
  selector: 'app-favorite-item-input-modal',
  imports: [CommonModule, FormsModule, EditModalBaseComponent],
  templateUrl: './favorite-item-input-modal.component.html',
  styleUrl: './favorite-item-input-modal.component.css',
})
export class FavoriteItemInputModalComponent implements OnInit {
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

  // カテゴリー選択肢（「すべて」を除く）
  categories = CATEGORIES.filter(cat => cat !== 'すべて');
  
  // ブランドデータ
  brands: Brand[] = [];
  isLoadingBrands = false;

  constructor(private brandService: BrandService) {}

  ngOnInit() {
    this.loadBrands();
  }

  // ブランド一覧を読み込み
  loadBrands() {
    console.log('ブランドデータ読み込み開始');
    this.isLoadingBrands = true;
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        console.log('ブランドデータ取得成功:', brands);
        this.brands = brands;
        this.isLoadingBrands = false;
      },
      error: (error) => {
        console.error('ブランドデータ読み込みエラー:', error);
        console.error('エラー詳細:', error.status, error.statusText);
        this.brands = []; // エラー時は空配列を設定
        this.isLoadingBrands = false;
      }
    });
  }

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
      this.submitItem.emit({
        itemName: this.item.itemName,
        brandName: this.item.brandName,
        category: this.item.category,
        price: this.item.price,
        memo: this.item.memo,
        url: this.item.url,
      });
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
