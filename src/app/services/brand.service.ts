import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/v2'; // Rails APIのURL
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private http: HttpClient) {}

  // 認証トークンを取得
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (this.isBrowser) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  // 全ブランドを取得
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/brands`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
    });
  }

  // 特定のブランドを取得
  getBrand(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/brands/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
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
        headers: this.getAuthHeaders(),
        withCredentials: true,
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
        headers: this.getAuthHeaders(),
        withCredentials: true,
      }
    );
  }

  // ブランドを削除
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/brands/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true,
    });
  }
}
