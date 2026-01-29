import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBaseComponent } from '../card-base/card-base.component';

@Component({
  selector: 'app-brand-card',
  imports: [CommonModule, CardBaseComponent],
  templateUrl: './brand-card.component.html',
})
export class BrandCardComponent {
  @Input() brand!: {
    name: string;
    category: string;
    description: string;
    url: string;
  };
}
