import { Component } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditModalBaseComponent } from '@/components/edit-modal-base/edit-modal-base.component';
import { CardBaseComponent } from '@/components/card-base/card-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryTabsComponent } from '@/components/category-tabs/category-tabs.component';

interface FavoriteItem {
  brandName: string;
  itemName: string;
  url: string;
  price: number | null;
  memo: string;
  category?: string;
}

@Component({
  selector: 'app-favorites',
  imports: [
    AddButtonComponent,
    EditModalBaseComponent,
    CardBaseComponent,
    FormsModule,
    CommonModule,
    CategoryTabsComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  // モーダル管理
  isModalOpen = false;
  
  // カテゴリー
  readonly CATEGORIES = [
    'すべて',
    'ファッション',
    'メイク',
    'アクセサリー',
    'カラコン',
    'その他',
  ];
  
  // 選択中のカテゴリー
  selectedCategory = 'すべて';
  
  // 新規アイテム
  newItem = this.getEmptyItem() as FavoriteItem;
  
  // お気に入りリスト（後でRails APIから取得）
  favorites: any[] = [];
  
  // ブランド名の選択肢（後でRails APIから取得）
  existingBrandNames: string[] = [];
  
  // 現在のカテゴリーを取得
  get currentCategory(): string {
    return this.selectedCategory;
  }
  
  // フィルタリングされたお気に入り
  get filteredFavorites(): any[] {
    if (this.selectedCategory === 'すべて') {
      return this.favorites;
    }
    return this.favorites.filter(item => item.category === this.selectedCategory);
  }
  
  // 子コンポーネント(タブ)からの通知を受け取る関数
  onCategoryChanged(category: string) {
    this.selectedCategory = category;
  }
  
  // モーダルのカテゴリーオプション
  get modalCategoryOptions() {
    return this.CATEGORIES.filter((c) => c !== 'すべて');
  }
  
  // 空のアイテムを作成
  private getEmptyItem(): FavoriteItem {
    return {
      brandName: '',
      itemName: '',
      url: '',
      price: null,
      memo: '',
      category: 'ファッション',
    };
  }
  
  // モーダルを開く
  openAddModal() {
    this.newItem = this.getEmptyItem();
    this.isModalOpen = true;
  }
  
  // モーダルを閉じる
  handleClose() {
    this.isModalOpen = false;
  }
  
  // 保存処理（後でRails APIと連携）
  async saveItem() {
    if (!this.newItem.brandName.trim() || !this.newItem.itemName.trim()) {
      alert('ブランド名と商品名は必須です');
      return;
    }
    
    // TODO: Rails APIにPOSTリクエストを送信
    console.log('アイテム保存:', this.newItem);
    
    // 仮のローカル追加
    this.favorites.unshift({
      id: Date.now(),
      ...this.newItem,
      createdAt: new Date(),
    });
    
    this.isModalOpen = false;
    this.newItem = this.getEmptyItem();
  }
}
