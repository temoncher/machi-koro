import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CoinView } from './CoinView';

const storyConfig: ComponentMeta<typeof CoinView> = {
  title: 'Game/CoinView',
  component: CoinView,
};

export default storyConfig;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CoinView> = (args) => <CoinView {...args} />;

export const Gold = Template.bind({});

Gold.args = {
  type: 'gold',
  children: 12,
};

export const Bronze = Template.bind({});

Bronze.args = {
  type: 'bronze',
  children: 12,
};
