import type { Meta, StoryObj } from '@storybook/angular';
import { BrandCardComponent } from '../app/components/brand-card/brand-card.component';

const meta: Meta<BrandCardComponent> = {
  title: 'Components/BrandCard',
  component: BrandCardComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BrandCardComponent>;

export const Default: Story = {
  args: {
    brand: {
      name: 'サンプルブランド',
      category: 'ファッション',
      description: 'これはブランドカードコンポーネントのサンプルです',
      url: 'https://example.com',
    },
  },
};
