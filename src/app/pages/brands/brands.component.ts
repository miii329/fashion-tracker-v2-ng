import { Component } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditModalBaseComponent } from '@/components/edit-modal-base/edit-modal-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryTabsComponent } from '@/components/category-tabs/category-tabs.component';

@Component({
  selector: 'app-brands',
  imports: [
    FormsModule,
    AddButtonComponent,
    EditModalBaseComponent,
    CommonModule,
    CategoryTabsComponent,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  // モーダル管理
  isModalOpen = false;

  // カテゴリーのリストを定義
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

  // モーダル入力用のオブジェクト
  newBrand = {
    name: '',
    category: '',
    description: '',
    url: '',
  };

  // ブランドリスト（後でRails APIから取得）
  brands: any[] = [];

  // フィルタリングされたブランド
  get filteredBrands(): any[] {
    if (this.selectedCategory === 'すべて') {
      return this.brands;
    }
    return this.brands.filter(
      (brand) => brand.category === this.selectedCategory,
    );
  }

  // 現在の選択カテゴリーを取得
  get currentCategory(): string {
    return this.selectedCategory;
  }

  // 子コンポーネント(タブ)から呼ばれる関数
  onCategoryChanged(category: string) {
    this.selectedCategory = category;
  }

  // モーダルを開く
  openAddModal() {
    this.newBrand = {
      name: '',
      category: '',
      description: '',
      url: '',
    };
    this.isModalOpen = true;
  }

  // モーダルを閉じる
  handleClose() {
    this.isModalOpen = false;
  }

  // モーダルのカテゴリーオプション
  get modalCategoryOptions() {
    return this.CATEGORIES.filter((c) => c !== 'すべて');
  }

  // 保存処理（後でRails APIと連携）
  async saveBrand() {
    if (this.newBrand.name.trim()) {
      // TODO: Rails APIにPOSTリクエストを送信
      console.log('ブランド保存:', this.newBrand);

      // 仮のローカル追加
      this.brands.unshift({
        id: Date.now(),
        ...this.newBrand,
        createdAt: new Date(),
      });

      this.isModalOpen = false;
      this.newBrand = {
        name: '',
        category: 'ファッション',
        description: '',
        url: '',
      };
    }
  }
}
