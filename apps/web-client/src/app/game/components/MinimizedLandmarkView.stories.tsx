import { allGameLandmarks } from '@machikoro/game-server-contracts';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { MinimizedLandmarkView } from './MinimizedLandmarkView';

const storyConfig: ComponentMeta<typeof MinimizedLandmarkView> = {
  title: 'Game/MinimizedLandmarkView',
  component: MinimizedLandmarkView,
};

export default storyConfig;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MinimizedLandmarkView> = (args) => <MinimizedLandmarkView {...args} />;

const cardInfo = allGameLandmarks.trainStation;

export const Constructed = Template.bind({});

Constructed.args = {
  underConstruction: false,
  cardInfo,
};

export const UnderConstruction = Template.bind({});

UnderConstruction.args = {
  underConstruction: true,
  cardInfo,
};
