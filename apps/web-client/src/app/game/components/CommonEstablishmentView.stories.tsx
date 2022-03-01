import { allGameEstablishments, establishmentsIds } from '@machikoro/game-server-contracts';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CommonEstablishmentView } from './CommonEstablishmentView';

const storyConfig: ComponentMeta<typeof CommonEstablishmentView> = {
  title: 'Game/CommonEstablishmentView',
  component: CommonEstablishmentView,
};

export default storyConfig;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommonEstablishmentView> = (args) => <CommonEstablishmentView {...args} />;

const wheatField = allGameEstablishments[establishmentsIds.wheatField]!;
const cardInfo = {
  ...wheatField,
  imageSrc: 'https://firebasestorage.googleapis.com/v0/b/machi-koro-dev.appspot.com/o/static%2Fwheat-field_256.png?alt=media&token=e803c336-e99e-4392-8fa0-5ec0beb67176',
};

export const Default = Template.bind({});

Default.args = {
  quantity: 10,
  cardInfo,
};

export const NoQuantity = Template.bind({});

NoQuantity.args = {
  cardInfo,
};

export const NoImage = Template.bind({});

NoImage.args = {
  quantity: 10,
  cardInfo: {
    ...cardInfo,
    imageSrc: undefined,
  },
};
