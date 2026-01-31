import { Component, OnInit } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { CardBaseComponent } from '@/components/card-base/card-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryTabsComponent } from '@/components/category-tabs/category-tabs.component';
import { FavoriteItemInputModalComponent } from "@/components/favorite-item-input-modal/favorite-item-input-modal.component";
import { FavoriteItemService, FavoriteItem } from '@/services/favorite-item.service';

@Component({
  selector: 'app-favorites',
  imports: [
    AddButtonComponent,
    CardBaseComponent,
    FormsModule,
    CommonModule,
    CategoryTabsComponent,
    FavoriteItemInputModalComponent
],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
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
  newItem = this.getEmptyItem();
  
  // お気に入りリスト
  favorites: FavoriteItem[] = [];
  
  // ブランド名の選択肢（後でRails APIから取得）
  existingBrandNames: string[] = [];

  constructor(private favoriteItemService: FavoriteItemService) {}

  ngOnInit() {
    this.loadFavoriteItems();
  }

  // お気に入りアイテムを読み込み
  loadFavoriteItems() {
    this.favoriteItemService.getFavoriteItems().subscribe({
      next: (items) => {
        this.favorites = items;
        console.log('お気に入りアイテムを読み込みました:', items);
      },
      error: (error) => {
        console.error('お気に入りアイテム読み込みエラー:', error);
      }
    });
  }
  
  // 現在のカテゴリーを取得
  get currentCategory(): string {
    return this.selectedCategory;
  }
  
  // フィルタリングされたお気に入り
  get filteredFavorites(): FavoriteItem[] {
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
  private getEmptyItem(): Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      brandName: '',
      itemName: '',
      url: '',
      price: undefined,
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
  closeModal() {
    this.isModalOpen = false;
  }
  
  // アイテムを送信（DBに保存）
  async submitItem(item: Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      console.log('アイテム保存:', item);
      
      // Rails APIにPOSTリクエストを送信
      const savedItem = await this.favoriteItemService.createFavoriteItem(item).toPromise();
      
      if (savedItem) {
        // ローカルリストに追加
        this.favorites.unshift(savedItem);
        console.log('アイテムを保存しました:', savedItem);
      }
      
      this.isModalOpen = false;
      this.newItem = this.getEmptyItem();
    } catch (error) {
      console.error('アイテム保存エラー:', error);
      alert('アイテムの保存に失敗しました。もう一度お試しください。');
    }
  }
}
