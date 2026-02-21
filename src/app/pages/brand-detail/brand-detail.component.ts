import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Brand, BrandService } from '@/services/brand.service';
import {
  FavoriteItem,
  FavoriteItemService,
} from '@/services/favorite-item.service';

@Component({
  selector: 'app-brand-detail',
  imports: [CommonModule, RouterLink],
  template: `
    @if (isLoading) {
      <div class="mt-10 text-gray-500">読み込み中...</div>
    } @else if (errorMessage) {
      <div class="mt-10 text-red-500">{{ errorMessage }}</div>
    } @else if (brand) {
      <div class="mt-20 flex items-start gap-8">
        <div class="w-36 h-36 flex items-center justify-center overflow-hidden">
          @if (faviconUrl && !faviconLoadError) {
            <img
              [src]="faviconUrl"
              [alt]="brand.name + ' icon'"
              class="w-full h-full object-cover"
              (error)="onFaviconError()"
            />
          }
        </div>

        <div class="pt-4 min-w-0">
          <p class="text-[44px] leading-none font-bold break-words">
            {{ brand.name }}
          </p>
          @if (brand.url) {
            <p class="mt-3 text-[16px] leading-6 break-all">
              {{ brand.url }}
            </p>
          }
        </div>
      </div>

      <p class="mt-14 leading-9">
        このブランドでのあなたのお気に入りしたアイテム
      </p>

      <div class="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
        @for (item of displayItems; track item.id ?? item.itemName) {
          <div>
            <div class="w-[136px] h-[136px] bg-gray-300"></div>
            <p class="mt-4 text-[16px] leading-7 break-words">
              {{ item.itemName }}
            </p>
            <p class="mt-3 text-[32px] leading-none">
              {{ formatPrice(item.price) }}
            </p>
          </div>
        } @empty {
          <div>
            <div class="w-[136px] h-[136px] bg-gray-300"></div>
            <p class="mt-4 text-[16px] leading-7">お気に入り未登録</p>
            <p class="mt-3 text-[32px] leading-none">-</p>
          </div>
          <div>
            <div class="w-[136px] h-[136px] bg-gray-300"></div>
            <p class="mt-4 text-[16px] leading-7">お気に入り未登録</p>
            <p class="mt-3 text-[32px] leading-none">-</p>
          </div>
        }
      </div>

      <button
        type="button"
        class="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-black text-white text-[10px]"
      >
        絞り込む
      </button>
    }
  `,
  styles: [],
})
export class BrandDetailComponent implements OnInit {
  brand: Brand | null = null;
  isLoading = true;
  errorMessage = '';
  faviconLoadError = false;
  favoriteItems: FavoriteItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private brandService: BrandService,
    private favoriteItemService: FavoriteItemService,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      this.isLoading = false;
      this.errorMessage = 'ブランドIDが不正です。';
      return;
    }

    this.brandService.getBrand(id).subscribe({
      next: (brand) => {
        this.brand = brand;
        this.isLoading = false;

        this.favoriteItemService.getFavoriteItems().subscribe({
          next: (items) => {
            this.favoriteItems = items;
          },
          error: () => {
            this.favoriteItems = [];
          },
        });
      },
      error: () => {
        this.errorMessage =
          'ブランド詳細を取得できませんでした。ログイン状態とAPI接続を確認してください。';
        this.isLoading = false;
      },
    });
  }

  get faviconUrl(): string {
    const domain = this.extractDomain(
      this.brand?.url || this.brand?.name || '',
    );
    if (!domain) {
      return '';
    }
    return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}`;
  }

  onFaviconError() {
    this.faviconLoadError = true;
  }

  get displayItems(): FavoriteItem[] {
    if (!this.brand) {
      return [];
    }

    return this.favoriteItems
      .filter(
        (item) =>
          item.brandName?.trim().toLowerCase() ===
          this.brand?.name.trim().toLowerCase(),
      )
      .slice(0, 2);
  }

  formatPrice(price?: number): string {
    if (price === undefined || price === null) {
      return '-';
    }

    return `¥${price.toLocaleString('ja-JP')}`;
  }

  private extractDomain(input: string): string | null {
    if (!input) {
      return null;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      return null;
    }

    try {
      return new URL(trimmed).hostname;
    } catch {
      try {
        return new URL(`https://${trimmed}`).hostname;
      } catch {
        return (
          trimmed
            .replace(/^https?:\/\//, '')
            .split('/')[0]
            .toLowerCase() || null
        );
      }
    }
  }
}
