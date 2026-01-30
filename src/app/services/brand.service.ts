import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Brand {
  id?: number;
  name: string;
  category: string;
  description: string;
  url: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private apiUrl = environment.apiUrl; // 環境変数からAPI URLを取得
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient) {}

  // 全ブランドを取得
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/brands`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 特定のブランドを取得
  getBrand(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/brands/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ブランドを作成
  createBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(
      `${this.apiUrl}/brands`,
      {
        name: brand.name,
        category: brand.category,
        description: brand.description,
        url: brand.url
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ブランドを更新
  updateBrand(id: number, brand: Brand): Observable<Brand> {
    return this.http.put<Brand>(
      `${this.apiUrl}/brands/${id}`,
      {
        name: brand.name,
        category: brand.category,
        description: brand.description,
        url: brand.url
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ブランドを削除
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/brands/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
