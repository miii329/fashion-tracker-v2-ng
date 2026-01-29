import type { Meta, StoryObj } from '@storybook/angular';
import { BrandInputModalComponent } from '../app/components/brand-input-modal/brand-input-modal.component';

const meta: Meta<BrandInputModalComponent> = {
  title: 'Components/BrandInputModal',
  component: BrandInputModalComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BrandInputModalComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};
