import {
  allGameEstablishments,
  allGameLandmarks,
  establishmentsIds,
  landmarksIds,
  PlayerConnectionStatus,
  UserId,
} from '@machikoro/game-server-contracts';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PlayerView } from './PlayerView';

const storyConfig: ComponentMeta<typeof PlayerView> = {
  title: 'Game/PlayerView',
  component: PlayerView,
};

export default storyConfig;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PlayerView> = (args) => <PlayerView sx={{ ml: 24 }} {...args} />;

export const Default = Template.bind({});

Default.args = {
  status: PlayerConnectionStatus.CONNECTED,
  coins: 10,
  player: {
    userId: 'mock-user-id' as UserId,
    username: 'Poor Jeff',
  },
  establishments: {
    [establishmentsIds.wheatField]: 1,
    [establishmentsIds.bakery]: 1,
  },
  landmarks: {
    [landmarksIds.trainStation]: true,
    [landmarksIds.shoppingMall]: true,
  },
  gameEstablishments: allGameEstablishments,
  gameLandmarks: allGameLandmarks,
};
