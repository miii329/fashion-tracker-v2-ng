import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  // スネークケースからキャメルケースへの変換
  private transformFromApi(data: any): FavoriteItem {
    return {
      id: data.id,
      itemName: data.item_name,
      brandName: data.brand_name,
      category: data.category,
      price: data.price,
      memo: data.memo,
      url: data.url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // キャメルケースからスネークケースへの変換
  private transformToApi(item: Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      item_name: item.itemName,
      brand_name: item.brandName,
      category: item.category,
      price: item.price,
      memo: item.memo,
      url: item.url,
    };
  }

  // 全お気に入りアイテムを取得
  getFavoriteItems(): Observable<FavoriteItem[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favorite_items`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(items => items.map(item => this.transformFromApi(item)))
    );
  }

  // 特定のお気に入りアイテムを取得
  getFavoriteItem(id: number): Observable<FavoriteItem> {
    return this.http.get<FavoriteItem>(`${this.apiUrl}/favorite_items/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // お気に入りアイテムを作成
  createFavoriteItem(item: Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>): Observable<FavoriteItem> {
    const payload = {
      favorite_item: this.transformToApi(item)
    };

    return this.http.post<any>(`${this.apiUrl}/favorite_items`, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => this.transformFromApi(response))
    );
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
