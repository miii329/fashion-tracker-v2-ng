import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBaseComponent } from '../card-base/card-base.component';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Brand } from '@/services/brand.service';

@Component({
  selector: 'app-brand-card',
  imports: [CommonModule, CardBaseComponent, RouterLink],
  templateUrl: './brand-card.component.html',
})
export class BrandCardComponent {
  faviconLoadError = false;

  @Input() brand!: Brand;

  constructor(private router: Router) {}

  get faviconUrl(): string {
    const domain = this.extractDomain(this.brand?.url || this.brand?.name);
    if (!domain) {
      return '';
    }
    return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}`;
  }

  onFaviconError() {
    this.faviconLoadError = true;
  }

  navigateToBrandDetail() {
    if (this.brand?.id) {
      this.router.navigate(['/brands', this.brand.id]);
      return;
    }

    if (this.brand?.url) {
      window.open(this.brand.url, '_blank', 'noopener,noreferrer');
    }
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
