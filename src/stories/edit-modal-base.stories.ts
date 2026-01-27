import type { Meta, StoryObj } from '@storybook/angular';
import { EditModalBaseComponent } from '../app/components/edit-modal-base/edit-modal-base.component';

const meta: Meta<EditModalBaseComponent> = {
  title: 'Components/EditModalBase',
  component: EditModalBaseComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EditModalBaseComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};
