import { Component, OnInit } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryTabsComponent } from '@/components/category-tabs/category-tabs.component';
import { BrandInputModalComponent } from "@/components/brand-input-modal/brand-input-modal.component";
import { BrandService, Brand } from '@/services/brand.service';
import { BrandCardComponent } from "@/components/brand-card/brand-card.component";
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-brands',
  imports: [
    FormsModule,
    AddButtonComponent,
    CommonModule,
    CategoryTabsComponent,
    BrandInputModalComponent,
    BrandCardComponent
],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
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

  // ブランドリスト（後でRails APIから取得）
  brands: Brand[] = [];

  constructor(private brandService: BrandService, private authService: AuthService) {}

  // コンポーネント初期化時にブランドデータを読み込み
  ngOnInit() {
    this.loadBrands();
    
    // ログイン状態の変化を監視
    this.authService.currentUser$.subscribe(() => {
      // ユーザー状態が変わったらブランドデータを再読み込み
      this.loadBrands();
    });
  }

  // ブランドデータをAPIから取得
  loadBrands() {
    const token = this.authService.getToken();
    console.log('Token exists:', !!token);
    console.log('Token value:', token?.substring(0, 20) + '...');
    console.log('Is logged in:', this.authService.isLoggedIn());
    
    // ログインしている場合のみユーザーのブランドを取得
    if (this.authService.isLoggedIn()) {
      this.brandService.getBrands().subscribe({
        next: (brands) => {
          this.brands = brands;
          console.log('ユーザーのブランドデータを読み込みました:', brands);
        },
        error: (error) => {
          console.error('ユーザーブランドデータ読み込みエラー:', error);
          
          // 401エラーの場合は認証情報をクリア
          if (error.status === 401) {
            console.log('認証エラー: トークンをクリアして再ログインが必要です');
            this.authService.clearUserState();
          }
        }
      });
    } else {
      // ログインしていない場合は空のリストを設定
      this.brands = [];
      console.log('ログインしていないため、ブランドデータは表示されません');
    }
  }

  // フィルタリングされたブランド
  get filteredBrands(): Brand[] {
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
    this.isModalOpen = true;
  }

  // モーダルを閉じる
  closeModal() {
    this.isModalOpen = false;
  }

  // 保存処理（Rails APIと連携）
  async submitBrand(brandData: { name: string; category: string; description: string; url: string }) {
    try {
      // BrandService経由でAPIにPOSTリクエストを送信
      const newBrand = await this.brandService.createBrand({
        name: brandData.name,
        category: brandData.category,
        description: brandData.description,
        url: brandData.url
      }).toPromise();

      if (newBrand) {
        console.log('ブランドを保存しました:', newBrand);
        // 成功した場合、ユーザーのブランドリストを再読み込み
        this.loadBrands();
      }
    } catch (error) {
      console.error('ブランド保存エラー:', error);
      // エラー処理（必要に応じてユーザーに通知）
    }

    this.isModalOpen = false;
  }
}
