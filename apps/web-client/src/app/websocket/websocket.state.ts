import { WebsocketConnectionStatus } from '../types';

export type WebsocketState = {
  status: WebsocketConnectionStatus;
};

export const initialWebsocketState: WebsocketState = {
  status: WebsocketConnectionStatus.PENDING,
};
