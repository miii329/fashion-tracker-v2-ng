import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { UserIconComponent } from '@/components/app-icon/app-icon.component';
import { LoginModalComponent } from '@/components/login-modal/login-modal.component';
import { RegisterModalComponent } from '@/components/register-modal/register-modal.component';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    UserIconComponent,
    LoginModalComponent,
    RegisterModalComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  user: any = null;
  showLoginModal = false;
  showRegisterModal = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(
        distinctUntilChanged(
          (prev, curr) => prev?.id === curr?.id && prev?.email === curr?.email,
        ),
      )
      .subscribe((user) => {
        this.user = user;
        console.log('currentUser updated:', user);
      });
  }

  login() {
    this.showLoginModal = true;
    this.showRegisterModal = false;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  switchToRegister() {
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  switchToLogin() {
    this.showRegisterModal = false;
    this.showLoginModal = true;
  }

  handleLogin(credentials: { email: string; password: string }) {
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

  handleRegister(userData: {
    fullname: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) {
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

  logout() {
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
