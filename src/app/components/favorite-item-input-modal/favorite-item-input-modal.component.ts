import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditModalBaseComponent } from '../edit-modal-base/edit-modal-base.component';
import { CATEGORIES } from '@/constants/categories';
import { BrandService, Brand } from '@/services/brand.service';
import { FavoriteItemService } from '@/services/favorite-item.service';

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
    imageUrl?: string;
  } = {
    itemName: '',
    brandName: '',
    category: '',
    price: undefined,
    memo: '',
    url: '',
    imageUrl: '',
  };

  // カテゴリー選択肢（「すべて」を除く）
  categories = CATEGORIES.filter((cat) => cat !== 'すべて');

  // ブランドデータ
  brands: Brand[] = [];
  isLoadingBrands = false;
  isFetchingMetadata = false;
  metadataMessage = '';
  metadataMessageType: 'error' | 'info' = 'info';
  previewImageUrl = '';

  constructor(
    private brandService: BrandService,
    private favoriteItemService: FavoriteItemService,
  ) {}

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
      },
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
    imageUrl?: string;
  }>();

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.item.itemName && this.item.brandName && this.item.category) {
      const imageUrl =
        this.item.imageUrl?.trim() || this.previewImageUrl?.trim() || undefined;

      this.submitItem.emit({
        itemName: this.item.itemName,
        brandName: this.item.brandName,
        category: this.item.category,
        price: this.item.price,
        memo: this.item.memo,
        url: this.item.url,
        imageUrl,
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
      imageUrl: '',
    };
  }

  get isValid(): boolean {
    return !!(this.item.itemName && this.item.brandName && this.item.category);
  }

  fillFromUrl() {
    const url = this.item.url?.trim();
    this.metadataMessage = '';
    this.previewImageUrl = '';

    if (!url) {
      this.metadataMessage = '先に商品URLを入力してください。';
      this.metadataMessageType = 'error';
      return;
    }

    this.isFetchingMetadata = true;
    this.favoriteItemService.previewFavoriteItem(url).subscribe({
      next: (preview) => {
        if (preview.itemName) {
          this.item.itemName = preview.itemName;
        }

        if (preview.brandName) {
          this.item.brandName = preview.brandName;
        }

        if (preview.category) {
          this.item.category = preview.category;
        }

        if (preview.price !== undefined && preview.price !== null) {
          this.item.price = preview.price;
        }

        if (preview.memo) {
          this.item.memo = preview.memo;
        }

        if (preview.url) {
          this.item.url = preview.url;
        }

        const imageUrl = preview.imageUrl?.trim() || '';
        this.item.imageUrl = imageUrl;
        this.previewImageUrl = imageUrl;

        const hasPreview = !!(
          this.item.itemName ||
          this.item.price != null ||
          this.item.imageUrl
        );

        this.metadataMessage = hasPreview
          ? 'プレビューを取得しました。内容を確認して保存してください。'
          : 'プレビューは取得できましたが、自動入力できる項目はありませんでした。';
        this.metadataMessageType = hasPreview ? 'info' : 'error';
        this.isFetchingMetadata = false;
      },
      error: () => {
        this.metadataMessage =
          'URLの解析に失敗しました。手入力で登録してください。';
        this.metadataMessageType = 'error';
        this.isFetchingMetadata = false;
      },
    });
  }
}
