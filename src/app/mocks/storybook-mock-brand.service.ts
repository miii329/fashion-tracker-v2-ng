import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Brand } from '@/services/brand.service';

@Injectable({
  providedIn: 'root'
})
export class StorybookMockBrandService {
  private mockBrands: Brand[] = [
    {
      id: 1,
      name: 'ZARA',
      category: 'ファッション',
      description: 'スペインのファストファッションブランド',
      url: 'https://www.zara.com'
    },
    {
      id: 2,
      name: 'UNIQLO',
      category: 'ファッション',
      description: '日本のカジュアルウェアブランド',
      url: 'https://www.uniqlo.com'
    },
    {
      id: 3,
      name: 'H&M',
      category: 'ファッション',
      description: 'スウェーデンのファストファッションブランド',
      url: 'https://www.hm.com'
    },
    {
      id: 4,
      name: 'SHISEIDO',
      category: 'メイク',
      description: '日本の化粧品ブランド',
      url: 'https://www.shiseido.co.jp'
    },
    {
      id: 5,
      name: 'Swarovski',
      category: 'アクセサリー',
      description: 'オーストリアのクリスタルブランド',
      url: 'https://www.swarovski.com'
    }
  ];

  getBrands(): Observable<Brand[]> {
    return of(this.mockBrands);
  }

  getBrand(id: number): Observable<Brand> {
    const brand = this.mockBrands.find(b => b.id === id);
    return of(brand as Brand);
  }

  createBrand(brand: Brand): Observable<Brand> {
    const newBrand = { ...brand, id: this.mockBrands.length + 1 };
    this.mockBrands.push(newBrand);
    return of(newBrand);
  }

  updateBrand(id: number, brand: Brand): Observable<Brand> {
    const index = this.mockBrands.findIndex(b => b.id === id);
    if (index !== -1) {
      this.mockBrands[index] = { ...brand, id };
    }
    return of({ ...brand, id });
  }

  deleteBrand(id: number): Observable<void> {
    this.mockBrands = this.mockBrands.filter(b => b.id !== id);
    return of(void 0);
  }
}
