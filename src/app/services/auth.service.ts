import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  private apiUrl = 'http://localhost:3000/api'; // Rails APIのURL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // ローカルストレージからユーザー情報を復元
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
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
      .post<AuthResponse>(`${this.apiUrl}/v2/users`, {
        user: {
          fullname: userData.fullname,
          email_address: userData.email,
          password: userData.password,
          password_confirmation: userData.passwordConfirm,
        },
      })
      .pipe(
        tap((response) => {
          // トークンとユーザー情報を保存
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
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
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, {
        user: {
          email: credentials.email,
          password: credentials.password,
        },
      })
      .pipe(
        tap((response) => {
          // トークンとユーザー情報を保存
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
      );
  }

  // ログアウト
  logout(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/logout`).pipe(
      tap(() => {
        // ローカルストレージをクリア
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
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
    return localStorage.getItem('authToken');
  }

  // ログイン状態を確認
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
