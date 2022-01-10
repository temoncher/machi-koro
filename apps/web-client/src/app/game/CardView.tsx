import { Establishment, Landmark } from '@machikoro/game-server-contracts';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { UrlUtils } from '../utils/url.utils';

import './CardView.css';

type CardSize = 'base' | 'lg' | 'sm' | 'xs';

type CardInfo = Landmark | Establishment;

type CardViewProps = {
  className?: string;
  cardInfo: CardInfo;
  size?: CardSize;
  quantity?: number;
  underConstruction?: boolean;
  onClick?: () => void;
};

type LandmarkViewProps = Omit<CardViewProps, 'cardInfo'> & {
  /* eslint-disable react/no-unused-prop-types */
  cardInfo: Landmark;
  underConstruction: boolean;
  onClick?: () => void;
  /* eslint-enable react/no-unused-prop-types */
};

type EstablishmentViewProps = Omit<CardViewProps, 'cardInfo'> & {
  /* eslint-disable react/no-unused-prop-types */
  cardInfo: Establishment;
  quantity: number;
  onClick?: () => void;
  /* eslint-enable react/no-unused-prop-types */
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

const getCommonProps = (cardInfo: CardInfo) => (
  cardInfo.domain === 'landmark' ? {
    ...cardInfo,
    tag: undefined,
    activation: undefined,
    quantity: undefined,
    establishmentId: undefined,
  }
    : {
      ...cardInfo,
      underConstruction: undefined,
      landmarkId: undefined,
    });

const CardView: React.FC<CardViewProps> = (props) => {
  const {
    activation,
    name,
    tagSrc,
    imageSrc,
    cost,
    descriptionText,
    domain,
  } = getCommonProps(props.cardInfo);

  const activationDiceRange = useMemo((): string => (activation ? activation.join('-') : ''), [activation]);
  const cardColor = useMemo(() => cardTypeToColorMap[domain], [domain]);

  const { backgroundImage, backgroundClass, textClass } = useMemo(
    () => ({
      backgroundImage: `url(${UrlUtils.getBackgroundImageCard(cardColor)}`,
      backgroundClass: `card-view--${cardColor}`,
      textClass: `card-view__name--${cardColor}`,
    }),
    [cardColor],
  );

  const underConstructionIcon = useMemo((): string => UrlUtils.getStaticImage('under-construction'), []);

  const scale = useMemo((): number => (props.size ? cardSizeToScaleMap[props.size] : cardSizeToScaleMap.base), [props.size]);

  return (
    <div
      className={clsx('card-view-wrapper', props.className)}
      role="button"
      style={{ ['--card-scale' as string]: scale }}
      tabIndex={0}
      onClick={props.onClick}
      onKeyDown={props.onClick}
    >
      <article
        className={clsx({
          /* eslint-disable @typescript-eslint/naming-convention */
          'card-view': true,
          [backgroundClass]: true,
          'card-view--faded': props.underConstruction,
          /* eslint-enable @typescript-eslint/naming-convention */
        })}
        style={{ backgroundImage }}
      >
        {domain !== 'landmark' && (
          <p className="card-view__sum-dice">
            {activationDiceRange}
          </p>
        )}

        {props.quantity && (
          <p className="card-view__count">
            {props.quantity}
          </p>
        )}

        <h2
          className={clsx({
            /* eslint-disable @typescript-eslint/naming-convention */
            'card-view__name': true,
            [textClass]: true,
            'card-view__name--disabled': props.underConstruction,
            /* eslint-enable @typescript-eslint/naming-convention */
          })}
          style={{ ['--bg-image' as string]: `url('${tagSrc}')` }}
        >
          {name}
        </h2>

        <div className="card-view__card-image-container">
          <img
            alt="card"
            className="card-view__card-image"
            src={imageSrc}
          />
        </div>

        <p className="card-view__effect">
          {cost && (
            <>
              <span className={clsx({
                /* eslint-disable @typescript-eslint/naming-convention */
                'card-view__cost-container': true,
                'card-view__cost-container--left': true,

                /* eslint-enable @typescript-eslint/naming-convention */
              })}
              >
                <span className="card-view__cost-background">
                  <span className="card-view__cost">{cost}</span>
                </span>
              </span>

              <span
                className={clsx({
                /* eslint-disable @typescript-eslint/naming-convention */
                  'card-view__cost-container': true,
                  'card-view__cost-container--right': true,

                /* eslint-enable @typescript-eslint/naming-convention */
                })}
              >
                <span className="card-view__cost-background" />
              </span>
            </>
          )}
          {descriptionText}
        </p>
      </article>

      {props.underConstruction && (
        <img
          alt="card"
          className="card-view-wrapper__under-construction-icon"
          src={underConstructionIcon}
        />
      )}
    </div>
  );
};

export const LandmarkView: React.FC<LandmarkViewProps> = (landmarkViewProps: LandmarkViewProps) => (
  <CardView
    /* eslint-disable react/destructuring-assignment */
    cardInfo={landmarkViewProps.cardInfo}
    className={landmarkViewProps.className}
    size={landmarkViewProps.size}
    underConstruction={landmarkViewProps.underConstruction}
    onClick={landmarkViewProps.onClick}
    /*  eslint-enable react/destructuring-assignment */
  />
);

export const CommonEstablishmentView: React.FC<EstablishmentViewProps> = (commonEstablishmentViewProps: EstablishmentViewProps) => (
  <CardView
    /* eslint-disable react/destructuring-assignment */
    cardInfo={commonEstablishmentViewProps.cardInfo}
    className={commonEstablishmentViewProps.className}
    quantity={commonEstablishmentViewProps.quantity}
    size={commonEstablishmentViewProps.size}
    onClick={commonEstablishmentViewProps.onClick}
    /*  eslint-enable react/destructuring-assignment */
  />
);
