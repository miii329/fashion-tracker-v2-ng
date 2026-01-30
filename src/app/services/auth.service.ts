import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // 環境変数からAPI URLを取得
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient) {
    // ブラウザ環境でのみローカルストレージからユーザー情報を復元
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  // 新規登録
  register(userData: {
    fullname: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/users`, {
        user: {
          fullname: userData.fullname,
          email_address: userData.email,
          password: userData.password,
          password_confirmation: userData.passwordConfirm,
        },
      })
      .pipe(
        tap((response) => {
          // ブラウザ環境でのみトークンとユーザー情報を保存
          if (this.isBrowser) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          this.currentUserSubject.next(response.user);
        }),
      );
  }

  // ログイン
  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/session`, {
        email_address: credentials.email,
        password: credentials.password,
      }, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          console.log('Login response:', response);
          
          // ブラウザ環境でのみトークンとユーザー情報を保存
          if (this.isBrowser) {
            // Rails APIがトークンを返さない場合はユーザー情報から緊急トークンを作成
            const user = response.user || response;
            const token = response.token || `emergency_${user.id}_${Date.now()}`;
            
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            console.log('Token saved:', token.substring(0, 20) + '...');
            console.log('User saved:', user.email_address);
          }
          this.currentUserSubject.next(response.user || response);
        }),
      );
  }

  // ログアウト
  logout(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/session`, { withCredentials: true }).pipe(
      tap(() => {
        // ブラウザ環境でのみローカルストレージをクリア
        if (this.isBrowser) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
      }),
    );
  }

  // 現在のユーザーを取得
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // トークンを取得
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // ログイン状態を確認
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ユーザー状態をクリア（401エラー時のログアウト用）
  clearUserState(): void {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }
}
