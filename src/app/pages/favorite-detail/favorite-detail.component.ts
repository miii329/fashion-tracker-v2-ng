import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FavoriteItem,
  FavoriteItemService,
} from '@/services/favorite-item.service';

@Component({
  selector: 'app-favorite-detail',
  imports: [CommonModule],
  templateUrl: './favorite-detail.component.html',
})
export class FavoriteDetailComponent implements OnInit {
  item: FavoriteItem | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private favoriteItemService: FavoriteItemService,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      this.isLoading = false;
      this.errorMessage = 'お気に入りIDが不正です。';
      return;
    }

    this.favoriteItemService.getFavoriteItem(id).subscribe({
      next: (item) => {
        this.item = item;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'お気に入り詳細を取得できませんでした。ログイン状態とAPI接続を確認してください。';
        this.isLoading = false;
      },
    });
  }

  formatPrice(price?: number): string {
    if (price === undefined || price === null) {
      return '-';
    }

    return `¥${price.toLocaleString('ja-JP')}`;
  }
}
