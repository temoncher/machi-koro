import clsx from 'clsx';
import React, { memo, useMemo } from 'react';

import { URLUtils } from '../utils/url.utils';

import './CardView.css';

type LandmarkType = 'landmarks';

type CommonEstablishmentType = 'majorEstablishments' | 'industry' | 'shopsFactoriesAndMarkets' | 'restaurants';

type CardType = LandmarkType | CommonEstablishmentType;

type CardInfo = {
  type: CardType;
  activationDice?: [number, number?];
  name: string;
  tagIcon: string;
  cardImage: string;
  buildCost?: number;
  descriptionText: string;
  underConstruction?: boolean;
};

type CardViewProps = {
  cardInfo: CardInfo;
};

type LandmarkInfo = Omit<CardInfo, 'type' | 'buildCost' | 'underConstruction'>
& {
  type: LandmarkType;
  buildCost: number;
  underConstruction: boolean;
};

type LandmarkViewProps = {
  cardInfo: LandmarkInfo;
};

type CommonEstablishmentInfo = Omit<CardInfo, 'type' >
& {
  type: CommonEstablishmentType;
};

type CommonEstablishmentViewProps = {
  cardInfo: CommonEstablishmentInfo;
};

const cardTypeToColorMap = {
  majorEstablishments: 'purple',
  restaurants: 'red',
  industry: 'blue',
  shopsFactoriesAndMarkets: 'green',
  landmarks: 'yellow',
} as const;

const CardView: React.FC<CardViewProps> = memo(({ cardInfo }: CardViewProps) => {
  const {
    type,
    activationDice,
    name,
    tagIcon,
    cardImage,
    buildCost,
    descriptionText,
    underConstruction,
  } = cardInfo;

  const activationDiceRange = useMemo((): string => (activationDice ? activationDice.join('-') : ''), [activationDice]);
  const cardColor = useMemo(() => cardTypeToColorMap[type], [type]);

  const { backgroundImage, backgroundClass, textClass } = useMemo(() => ({
    backgroundImage: `url(${URLUtils.getBackgroundImageCard(cardColor)}`,
    backgroundClass: `card-view--${cardColor}`,
    textClass: `card-view__name--${cardColor}`,
  }), [cardColor]);

  const underConstructionIcon = useMemo((): string => URLUtils.getStaticImageURL('under-construction'), []);

  return (
    <div className="card-view-wrapper">
      <article
        className={clsx({
          /* eslint-disable @typescript-eslint/naming-convention */

          'card-view': true,
          [backgroundClass]: true,
          'card-view--faded': underConstruction,

          /* eslint-enable @typescript-eslint/naming-convention */
        })}
        style={{ backgroundImage }}
      >

        {activationDice && (
        <p className="card-view__sum-dice">
          {activationDiceRange}
        </p>
        )}

        <h2
          style={{ ['--bg-image' as string]: `url('${tagIcon}')` }}
          className={clsx({
          /* eslint-disable @typescript-eslint/naming-convention */

            'card-view__name': true,
            [textClass]: true,
            'card-view__name--disabled': underConstruction,

          /* eslint-enable @typescript-eslint/naming-convention */
          })}
        >
          { name }
        </h2>

        <div className="card-view__card-image-container">
          <img
            className="card-view__card-image"
            src={cardImage}
            alt="card"
          />
        </div>

        <p
          className="card-view__effect"
        >
          {buildCost && (
          <span className={clsx({
          /* eslint-disable @typescript-eslint/naming-convention */

            'card-view__cost-container': true,
            'card-view__cost-container_left': true,

          /* eslint-disable @typescript-eslint/naming-convention */
          })}
          >
            <span className="card-view__cost-background">
              <span className="card-view__cost">{buildCost}</span>
            </span>
          </span>

          )}
          {buildCost && (
          <span className={clsx({
            /* eslint-disable @typescript-eslint/naming-convention */

            'card-view__cost-container': true,
            'card-view__cost-container_right': true,

            /* eslint-disable @typescript-eslint/naming-convention */
          })}
          >
            <span className="card-view__cost-background" />
          </span>
          )}
          {descriptionText}
        </p>

      </article>

      { underConstruction && (
      <img
        className="card-view-wrapper__under-construction-icon"
        src={underConstructionIcon}
        alt="card"
      />
      )}
    </div>
  );
});

export const LandmarkView: React.FC<LandmarkViewProps> = ({ cardInfo }: LandmarkViewProps) => (
  <CardView cardInfo={cardInfo} />
);

export const CommonEstablishmentView:
React.FC<CommonEstablishmentViewProps> = ({ cardInfo }:
CommonEstablishmentViewProps) => (
  <CardView cardInfo={cardInfo} />
);
