import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DiceCombinationView } from './DiceCombinationView';

const storyConfig: ComponentMeta<typeof DiceCombinationView> = {
  title: 'Game/DiceCombinationView',
  component: DiceCombinationView,
};

export default storyConfig;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DiceCombinationView> = (args) => <DiceCombinationView {...args} />;

export const SingleDice = Template.bind({});

SingleDice.args = {
  rolledDiceCombination: [2, undefined],
};

export const TwoDice = Template.bind({});

TwoDice.args = {
  rolledDiceCombination: [2, 2],
};
