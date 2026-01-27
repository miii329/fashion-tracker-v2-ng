import type { Meta, StoryObj } from '@storybook/angular';
import { RegisterModalComponent } from '../app/components/register-modal/register-modal.component';

const meta: Meta<RegisterModalComponent> = {
  title: 'Components/RegisterModal',
  component: RegisterModalComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<RegisterModalComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};
