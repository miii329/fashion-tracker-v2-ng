import type { Meta, StoryObj } from '@storybook/angular';
import { FavoriteItemInputModalComponent } from '../app/components/favorite-item-input-modal/favorite-item-input-modal.component';

const meta: Meta<FavoriteItemInputModalComponent> = {
  title: 'Components/FavoriteItemInputModal',
  component: FavoriteItemInputModalComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FavoriteItemInputModalComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};
