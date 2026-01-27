import type { Meta, StoryObj } from '@storybook/angular';
import { CardBaseComponent } from '../app/components/card-base/card-base.component';

const meta: Meta<CardBaseComponent> = {
  title: 'Components/CardBase',
  component: CardBaseComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CardBaseComponent>;

export const Default: Story = {
  args: {
    title: 'サンプルカード',
    category: 'ファッション',
    description: 'これはカードベースコンポーネントのサンプルです',
    url: 'https://example.com',
  },
};
