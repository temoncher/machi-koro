export namespace RecordUtils {
  export const modifyAt = <V>(
    key: string,
    modify: (previousValue: V) => V,
    record: Record<string, V>,
  ): Record<string, V> => Object.fromEntries(Object.entries(record).map(([recordKey, value]) => {
      if (recordKey === key) {
        return [recordKey, modify(value)];
      }

      return [recordKey, value];
    }));

  export const mapWithIndex = <T, V>(
    mapping: (index: string, value: T) => V,
    record: Record<string, T>,
  ): Record<string, V> => Object.fromEntries(Object.entries(record).map(
      ([key, value]) => [key, mapping(key, value)],
    ));

  export const map = <T, V>(
    mapping: (value: T) => V,
    record: Record<string, T>,
  ): Record<string, V> => Object.fromEntries(Object.entries(record).map(
      ([key, value]) => [key, mapping(value)],
    ));
}
