import { WebsocketConnectionStatus } from '../types/WebsocketConnectionStatus';

export type WebsocketState = {
  status: WebsocketConnectionStatus;
};

export const initialWebsocketState: WebsocketState = {
  status: WebsocketConnectionStatus.PENDING,
};
