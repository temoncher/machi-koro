import { UserId, User } from './user.model';

export type CommonEstablishmentDomain = 'majorEstablishment' | 'industry' | 'shopsFactoriesAndMarket' | 'restaurant';

export type CommonEstablishmentType = 'wheat' | 'livestock' | 'box' | 'cup' | 'gear' | 'enterprise' | 'apple' | 'establishment';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type LandmarkId = string & { readonly LANDMARK_ID: unique symbol };

// eslint-disable-next-line @typescript-eslint/naming-convention
export type EstablishmentId = string & { readonly ESTABLISHMENT_ID: unique symbol };

export type LandmarkDomain = 'landmark';

export type CommonEstablishmentFields = {
  name: string;
  tagSrc: string;
  imageSrc: string;
  descriptionText: string;
  cost: number;
};

export type Landmark = CommonEstablishmentFields & {
  landmarkId: LandmarkId;
  domain: LandmarkDomain;
};

export type Establishment = CommonEstablishmentFields & {
  establishmentId: EstablishmentId;
  domain: CommonEstablishmentDomain;
  tag: CommonEstablishmentType;
  activation: number[];
};

export type EstablishmentApplyEffect = Record<EstablishmentId, (context: GameContext) => GameContext>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type GameId = string & { readonly GAME_ID: unique symbol };

export enum PlayerConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ABANDONED = 'ABANDONED',
}

export type PlayerConnectionStatusesMap = Record<UserId, PlayerConnectionStatus>;

type RollDiceMessage = {
  type: 'ROLL_DICE';
  userId: UserId;
};
type Pass = {
  type: 'PASS';
  userId: UserId;
};
type BuildEstablishment = {
  type: 'BUILD_ESTABLISHMENT';
  userId: UserId;
  payload: EstablishmentId;
};
type BuildLandmark = {
  type: 'BUILD_LANDMARK';
  userId: UserId;
  payload: LandmarkId;
};

export type GameMachineMessage =
  | RollDiceMessage
  | Pass
  | BuildEstablishment
  | BuildLandmark;

export type Game = {
  gameId: GameId;
  hostId: UserId;
  players: Record<UserId, User>;
  playersConnectionStatuses: PlayerConnectionStatusesMap;

  log?: GameMachineMessage[];
  context?: GameContext;
};

export type GameContext = {
  shop: Record<EstablishmentId, number>;
  activePlayerId: UserId;
  playersIds: UserId[];
  establishments: Record<UserId, Record<EstablishmentId, number>>;
  coins: Record<UserId, number>;
  landmarks: Record<UserId, Record<LandmarkId, boolean>>;
  rollDiceResult: number;
  gameLandmarks: Record<LandmarkId, Landmark>;
  gameEstablishments: Record<EstablishmentId, Establishment>;
  winnerId: UserId | undefined;
};

export type ApplyEffects = (
  establishmentId: EstablishmentId,
  income: number,
  activetedEstablishmentType?: CommonEstablishmentType
) => (context: GameContext) => GameContext;

export type EstablishmentEffect = (context: GameContext) => GameContext;
