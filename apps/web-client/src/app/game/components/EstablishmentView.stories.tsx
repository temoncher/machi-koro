import { allGameEstablishments, establishmentsIds } from '@machikoro/game-server-contracts';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { EstablishmentView } from './EstablishmentView';

const storyConfig: ComponentMeta<typeof EstablishmentView> = {
  title: 'Game/CommonEstablishmentView',
  component: EstablishmentView,
};

export default storyConfig;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EstablishmentView> = (args) => <EstablishmentView {...args} />;

const wheatField = allGameEstablishments[establishmentsIds.wheatField]!;
const cardInfo = {
  ...wheatField,
  imageSrc: 'https://firebasestorage.googleapis.com/v0/b/machi-koro-dev.appspot.com/o/static%2Fwheat-field_256.png?alt=media&token=dce41e21-3de9-45d3-aebf-e46869489e3a',
};

export const Default = Template.bind({});

Default.args = {
  quantity: 10,
  establishment: cardInfo,
};

export const NoQuantity = Template.bind({});

NoQuantity.args = {
  establishment: cardInfo,
};

export const NoImage = Template.bind({});

NoImage.args = {
  quantity: 10,
  establishment: {
    ...cardInfo,
    imageSrc: undefined,
  },
};
