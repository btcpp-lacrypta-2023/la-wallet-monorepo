import type { Meta, StoryObj } from '@storybook/react';

import { CardAlert } from '../components';

const meta = {
  title: 'Atoms/CardAlert',
  component: CardAlert,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof CardAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const defaultComponent: Story = {
  args: {
    title: 'Lorem ipsum dolor.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
  },
};

export const isNotHome: Story = {
  args: {
    title: 'Lorem ipsum dolor.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    isHome: false,
  },
};
