import type { Meta, StoryObj } from '@storybook/angular';
import { LoginModalComponent } from '../app/components/login-modal/login-modal.component';

const meta: Meta<LoginModalComponent> = {
  title: 'Components/LoginModal',
  component: LoginModalComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<LoginModalComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};
