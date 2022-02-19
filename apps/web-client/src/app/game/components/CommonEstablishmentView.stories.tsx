import { allGameEstablishments } from '@machikoro/game-server-contracts';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CommonEstablishmentView } from './CommonEstablishmentView';

const storyConfig: ComponentMeta<typeof CommonEstablishmentView> = {
  title: 'Game/CommonEstablishmentView',
  component: CommonEstablishmentView,
};

export default storyConfig;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommonEstablishmentView> = (args) => <CommonEstablishmentView {...args} />;

const cardInfo = allGameEstablishments.wheatField;

export const NoQuantity = Template.bind({});

NoQuantity.args = {
  cardInfo,
};

export const WithQuantity = Template.bind({});

WithQuantity.args = {
  quantity: 10,
  cardInfo,
};
