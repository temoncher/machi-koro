import { ServerSentActionTypes } from '@machikoro/game-server-contracts';
import { filter, map, Observable } from 'rxjs';

export const ofWsEventType = <T extends keyof ServerSentActionTypes>(
  type: T,
) => <S extends ServerSentActionTypes[keyof ServerSentActionTypes]>(source: Observable<S>) => source.pipe(
    filter((event) => event.type === type),
    map((event) => event as unknown as ServerSentActionTypes[T]),
  );
