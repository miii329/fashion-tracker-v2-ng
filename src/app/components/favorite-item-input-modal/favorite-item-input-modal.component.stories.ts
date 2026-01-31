import type { Meta, StoryObj } from '@storybook/angular';
import { FavoriteItemInputModalComponent } from './favorite-item-input-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { applicationConfig } from '@storybook/angular';
import { BrandService } from '@/services/brand.service';
import { StorybookMockBrandService } from '@/mocks/storybook-mock-brand.service';

const meta: Meta<FavoriteItemInputModalComponent> = {
  title: 'Components/FavoriteItemInputModal',
  component: FavoriteItemInputModalComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        { provide: BrandService, useClass: StorybookMockBrandService }
      ]
    })
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## お気に入り商品入力モーダル

商品情報を入力するモーダルコンポーネント。

### 特徴:
- ブランド名は既存ブランドから選択
- カテゴリはプルダウンから選択
- 価格、メモ、URLは任意入力

### ブランド選択:
- 本番: DBから取得したブランド一覧
- Storybook: モックデータを表示
        `
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FavoriteItemInputModalComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
    item: {
      itemName: '',
      brandName: '',
      category: '',
      price: undefined,
      memo: '',
      url: '',
    }
  },
};

export const WithData: Story = {
  args: {
    isOpen: true,
    item: {
      itemName: 'ストライプシャツ',
      brandName: 'ZARA',
      category: 'ファッション',
      price: 3990,
      memo: '春物新作',
      url: 'https://example.com',
    }
  },
};
