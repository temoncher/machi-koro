import clsx from 'clsx';
import React, { memo, useMemo } from 'react';

import { Landmark, CommonEstablishment } from '../types/types';
import { URLUtils } from '../utils/url.utils';

import './CardView.css';

type CardSize = 'base' | 'lg' | 'sm' | 'xs';

type CardInfo = Landmark | CommonEstablishment;

type CardViewProps = {
  className?: string;
  cardInfo: CardInfo;
  size?: CardSize;
};

type LandmarkViewProps = Omit<CardViewProps, 'cardInfo'> & {
  cardInfo: Landmark;
};

type CommonEstablishmentViewProps = Omit<CardViewProps, 'cardInfo'> & {
  cardInfo: CommonEstablishment;
};

const cardSizeToScaleMap = {
  xs: 0.25,
  base: 0.6,
  sm: 0.5,
  lg: 1,
} as const;

const cardTypeToColorMap = {
  majorEstablishment: 'purple',
  restaurant: 'red',
  industry: 'blue',
  shopsFactoriesAndMarket: 'green',
  landmark: 'yellow',
} as const;

const getCommonProps = (cardInfo: CardInfo) => ({
  ...cardInfo,
  activationDice: 'activationDice' in cardInfo ? cardInfo.activationDice : undefined,
  count: 'count' in cardInfo ? cardInfo.count : undefined,
  underConstruction: 'underConstruction' in cardInfo ? cardInfo.underConstruction : undefined,
});

const CardView: React.FC<CardViewProps> = memo(({ className, cardInfo, size }: CardViewProps) => {
  const {
    type,
    count,
    activationDice,
    name,
    tagSrc,
    establishmentImageSrc,
    buildCost,
    descriptionText,
    underConstruction,
  } = getCommonProps(cardInfo);

  const activationDiceRange = useMemo((): string => (activationDice ? activationDice.join('-') : ''), [activationDice]);
  const cardColor = useMemo(() => cardTypeToColorMap[type], [type]);

  const { backgroundImage, backgroundClass, textClass } = useMemo(() => ({
    backgroundImage: `url(${URLUtils.getBackgroundImageCard(cardColor)}`,
    backgroundClass: `card-view--${cardColor}`,
    textClass: `card-view__name--${cardColor}`,
  }), [cardColor]);

  const underConstructionIcon = useMemo((): string => URLUtils.getStaticImageURL('under-construction'), []);

  const scale = useMemo((): number => (size ? cardSizeToScaleMap[size] : cardSizeToScaleMap.base), [size]);

  return (
    <div className={clsx('card-view-wrapper', className)} style={{ ['--card-scale' as string]: scale }}>
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

        {type !== 'landmark' && (
          <p className="card-view__sum-dice">
            {activationDiceRange}
          </p>
        )}

        {count && (
        <p className="card-view__count">
          {count}
        </p>
        )}

        <h2
          style={{ ['--bg-image' as string]: `url('${tagSrc}')` }}
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
            src={establishmentImageSrc}
            alt="card"
          />
        </div>

        <p
          className="card-view__effect"
        >
          {buildCost && (
            <>
              <span className={clsx({
                /* eslint-disable @typescript-eslint/naming-convention */

                'card-view__cost-container': true,
                'card-view__cost-container--left': true,

                /* eslint-disable @typescript-eslint/naming-convention */
              })}
              >
                <span className="card-view__cost-background">
                  <span className="card-view__cost">{buildCost}</span>
                </span>
              </span>

              <span className={clsx({
                /* eslint-disable @typescript-eslint/naming-convention */

                'card-view__cost-container': true,
                'card-view__cost-container--right': true,

                /* eslint-disable @typescript-eslint/naming-convention */
              })}
              >
                <span className="card-view__cost-background" />
              </span>
            </>
          )}
          {descriptionText}
        </p>

      </article>

      {underConstruction && (
      <img
        className="card-view-wrapper__under-construction-icon"
        src={underConstructionIcon}
        alt="card"
      />
      )}
    </div>
  );
});

export const LandmarkView: React.FC<LandmarkViewProps> = (landmarkViewProps: LandmarkViewProps) => (
  <CardView
  /*  eslint-disable react/destructuring-assignment */
    className={landmarkViewProps.className}
    cardInfo={landmarkViewProps.cardInfo}
    size={landmarkViewProps.size}
  /*  eslint-enable react/destructuring-assignment */
  />
);

export const CommonEstablishmentView:
React.FC<CommonEstablishmentViewProps> = (commonEstablishmentViewProps:
CommonEstablishmentViewProps) => (
  <CardView
  /*  eslint-disable react/destructuring-assignment */
    className={commonEstablishmentViewProps.className}
    cardInfo={commonEstablishmentViewProps.cardInfo}
    size={commonEstablishmentViewProps.size}
    /*  eslint-enable react/destructuring-assignment */
  />
);
