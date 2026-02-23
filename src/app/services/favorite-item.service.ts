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
  imageUrl?: string;
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

  private toNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.replace(/,/g, '').trim();
      if (!normalized) {
        return undefined;
      }

      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
  }

  // スネークケースからキャメルケースへの変換
  private transformFromApi(data: any): FavoriteItem {
    const source = data?.favorite_item ?? data?.item ?? data;
    const topLevelId = this.toNumber(data?.id);
    const nestedId = this.toNumber(source?.id ?? source?.item_id);
    const normalizedPrice = this.toNumber(source?.price);

    return {
      id: topLevelId ?? nestedId,
      itemName: source.item_name ?? source.itemName,
      brandName: source.brand_name ?? source.brandName,
      category: source.category,
      price: normalizedPrice,
      memo: source.memo,
      url: source.url,
      imageUrl: source.image_url ?? source.imageUrl,
      createdAt: source.created_at ?? source.createdAt,
      updatedAt: source.updated_at ?? source.updatedAt,
    };
  }

  // キャメルケースからスネークケースへの変換
  private transformToApi(
    item: Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>,
  ): any {
    return {
      item_name: item.itemName,
      brand_name: item.brandName,
      category: item.category,
      price: item.price,
      memo: item.memo,
      url: item.url,
      image_url: item.imageUrl,
    };
  }

  // 全お気に入りアイテムを取得
  getFavoriteItems(): Observable<FavoriteItem[]> {
    return this.http
      .get<any>(`${this.apiUrl}/favorite_items`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response) => {
          const items = Array.isArray(response)
            ? response
            : (response?.favorite_items ??
              response?.items ??
              response?.data ??
              []);

          if (!Array.isArray(items)) {
            return [];
          }

          return items.map((item) => this.transformFromApi(item));
        }),
      );
  }

  // 特定のお気に入りアイテムを取得
  getFavoriteItem(id: number): Observable<FavoriteItem> {
    return this.http
      .get<any>(`${this.apiUrl}/favorite_items/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(map((item) => this.transformFromApi(item)));
  }

  // お気に入りアイテムを作成
  createFavoriteItem(
    item: Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<FavoriteItem> {
    const payload = {
      favorite_item: this.transformToApi(item),
    };

    return this.http
      .post<any>(`${this.apiUrl}/favorite_items`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(map((response) => this.transformFromApi(response)));
  }

  // URLプレビュー（バックエンドで解析）
  previewFavoriteItem(
    url: string,
  ): Observable<Partial<Omit<FavoriteItem, 'id' | 'createdAt' | 'updatedAt'>>> {
    return this.http
      .post<any>(
        `${this.apiUrl}/favorite_items/preview`,
        { url },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .pipe(
        map((response) => {
          const normalized = this.transformFromApi(response);

          return {
            itemName: normalized.itemName,
            brandName: normalized.brandName,
            category: normalized.category,
            price: normalized.price,
            memo: normalized.memo,
            url: normalized.url ?? url,
            imageUrl: normalized.imageUrl,
          };
        }),
      );
  }

  // お気に入りアイテムを更新
  updateFavoriteItem(
    id: number,
    item: Partial<FavoriteItem>,
  ): Observable<FavoriteItem> {
    return this.http.put<FavoriteItem>(
      `${this.apiUrl}/favorite_items/${id}`,
      item,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // お気に入りアイテムを削除
  deleteFavoriteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorite_items/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
