import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserIconComponent } from './components/app-icon/app-icon.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, // <router-outlet> を使うために必要
    RouterLink, // [routerLink] を使うために必要
    RouterLinkActive, // [routerLinkActive] を使うために必要
    CommonModule,
    UserIconComponent, // ユーザーアイコンコンポーネント
    LoginModalComponent, // ログインモーダルコンポーネント
    RegisterModalComponent, // 新規登録モーダルコンポーネント
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  // タイトル
  title = 'fashion-trends-tracker';
  // カテゴリー管理用（初期値は 'すべて'）
  selectedCategory: string = 'すべて';
  // ログインユーザーの状態
  user: any = null;
  // ログインモーダルの表示状態
  showLoginModal = false;
  // 新規登録モーダルの表示状態
  showRegisterModal = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // ユーザー状態を購読
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      console.log('currentUser updated:', user);
    });
  }

  // ログインモーダルを開く
  login() {
    this.showLoginModal = true;
    this.showRegisterModal = false;
  }

  // ログインモーダルを閉じる
  closeLoginModal() {
    this.showLoginModal = false;
  }

  // 新規登録モーダルを閉じる
  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  // ログインから新規登録へ切り替え
  switchToRegister() {
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  // 新規登録からログインへ切り替え
  switchToLogin() {
    this.showRegisterModal = false;
    this.showLoginModal = true;
  }

  // ログイン処理
  async handleLogin(credentials: { email: string; password: string }) {
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('ログイン成功', response);
        this.closeLoginModal();
      },
      error: (error) => {
        console.error('ログインエラー', error);
        alert(
          'ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。',
        );
      },
    });
  }

  // 新規登録処理
  async handleRegister(userData: {
    fullname: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) {
    // パスワード一致確認
    if (userData.password !== userData.passwordConfirm) {
      alert('パスワードが一致しません。');
      return;
    }

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('新規登録成功', response);
        this.closeRegisterModal();
        alert('登録が完了しました！');
      },
      error: (error) => {
        console.error('新規登録エラー - 完全なエラーオブジェクト:', error);
        console.error('ステータスコード:', error.status);
        console.error('エラーメッセージ:', error.message);
        console.error('エラーレスポンス:', error.error);
        console.error('エラーURL:', error.url);

        let errorMessage = '登録に失敗しました。もう一度お試しください。';

        // ステータスコードに応じたメッセージ
        if (error.status === 0) {
          errorMessage =
            'サーバーに接続できません。Rails APIが起動しているか確認してください。\nURL: http://localhost:3000/api/v2/users';
        } else if (error.status === 404) {
          errorMessage = 'エンドポイントが見つかりません。\nURL: ' + error.url;
        } else if (error.status === 422) {
          errorMessage =
            'バリデーションエラー:\n' + JSON.stringify(error.error, null, 2);
        } else if (error.error?.errors) {
          errorMessage = Array.isArray(error.error.errors)
            ? error.error.errors.join('\n')
            : JSON.stringify(error.error.errors, null, 2);
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        alert(errorMessage);
      },
    });
  }

  // ログアウト処理
  async logout() {
    if (confirm('ログアウトしますか？')) {
      this.authService.logout().subscribe({
        next: () => {
          console.log('ログアウトしました');
          console.log('current user after logout:', this.user);
        },
        error: (error) => {
          console.error('ログアウトエラー', error);
        },
      });
    }
  }
}
