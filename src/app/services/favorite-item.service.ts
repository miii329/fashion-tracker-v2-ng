import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FavoriteItem {
  id?: number;
  itemName: string;
  brandName: string;
  category: string;
  price?: number;
  memo?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteItemService {
  private apiUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient) {}

  // 全お気に入りアイテムを取得
  getFavoriteItems(): Observable<FavoriteItem[]> {
    return this.http.get<FavoriteItem[]>(`${this.apiUrl}/favorite_items`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 特定のお気に入りアイテムを取得
  getFavoriteItem(id: number): Observable<FavoriteItem> {
    return this.http.get<FavoriteItem>(`${this.apiUrl}/favorite_items/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // お気に入りアイテムを作成
  createFavoriteItem(item: Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>): Observable<FavoriteItem> {
    return this.http.post<FavoriteItem>(`${this.apiUrl}/favorite_items`, item, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // お気に入りアイテムを更新
  updateFavoriteItem(id: number, item: Partial<FavoriteItem>): Observable<FavoriteItem> {
    return this.http.put<FavoriteItem>(`${this.apiUrl}/favorite_items/${id}`, item, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // お気に入りアイテムを削除
  deleteFavoriteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorite_items/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
