import type { Meta, StoryObj } from '@storybook/angular';
import { FavoriteItemCardComponent } from '../app/components/favorite-item-card/favorite-item-card.component';

const meta: Meta<FavoriteItemCardComponent> = {
  title: 'Components/FavoriteItemCard',
  component: FavoriteItemCardComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FavoriteItemCardComponent>;

export const Default: Story = {
  args: {
    item: {
      itemName: 'ストライプシャツ',
      brandName: 'ZARA',
      category: 'トップス',
      price: 4990,
      memo: 'カジュアルに着られるストライプシャツ。夏に最適。',
      url: 'https://example.com/item/12345',
    },
  },
};

export const WithoutPrice: Story = {
  args: {
    item: {
      itemName: 'デニムパンツ',
      brandName: 'UNIQLO',
      category: 'ボトムス',
      memo: 'シンプルなデニム。合わせやすい。',
    },
  },
};
