import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBaseComponent } from '../card-base/card-base.component';

@Component({
  selector: 'app-favorite-item-card',
  imports: [CommonModule, CardBaseComponent],
  templateUrl: './favorite-item-card.component.html',
  styleUrl: './favorite-item-card.component.css',
})
export class FavoriteItemCardComponent {
  @Input() item!: {
    itemName: string;
    brandName: string;
    category: string;
    price?: number;
    memo?: string;
    url?: string;
  };
}
