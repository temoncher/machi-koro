export const testId = <ID extends string>(id: ID): `[data-test-id=${ID}]` => `[data-test-id=${id}]`;
