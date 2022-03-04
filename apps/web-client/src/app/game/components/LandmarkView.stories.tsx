import { allGameLandmarks, landmarksIds } from '@machikoro/game-server-contracts';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LandmarkView } from './LandmarkView';

const storyConfig: ComponentMeta<typeof LandmarkView> = {
  title: 'Game/LandmarkView',
  component: LandmarkView,
};

export default storyConfig;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LandmarkView> = (args) => <LandmarkView {...args} />;

const cardInfo = allGameLandmarks[landmarksIds.trainStation];

export const Constructed = Template.bind({});

Constructed.args = {
  underConstruction: false,
  landmark: cardInfo,
};

export const UnderConstruction = Template.bind({});

UnderConstruction.args = {
  underConstruction: true,
  landmark: cardInfo,
};
