export const setKeyCaseBasedValue = <T>(target: Record<string, T>, key: string, isKeySensitive: boolean, value: T) => {
    // eslint-disable-next-line no-param-reassign
    target[isKeySensitive ? key : key.toLocaleLowerCase()] = value;
};
