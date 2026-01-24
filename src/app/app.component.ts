import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserIconComponent } from './components/app-icon/app-icon.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, // <router-outlet> を使うために必要
    RouterLink, // [routerLink] を使うために必要
    RouterLinkActive, // [routerLinkActive] を使うために必要
    CommonModule,
    UserIconComponent, // ユーザーアイコンコンポーネント
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // タイトル
  title = 'fashion-trends-tracker';
  // カテゴリー管理用（初期値は 'すべて'）
  selectedCategory: string = 'すべて';
  // ログインユーザーの状態（後でRails APIと連携）
  user: any = null;

  // ログイン処理（後でRails APIと連携）
  async login() {
    // TODO: Rails APIと連携した認証処理を実装
    console.log('ログイン処理');
  }

  // ログアウト処理（後でRails APIと連携）
  async logout() {
    if (confirm('ログアウトしますか？')) {
      // TODO: Rails APIと連携したログアウト処理を実装
      console.log('ログアウト処理');
    }
  }
}
