export const getKeyCaseBasedValue = <T>(source: Record<string, T>, key: string, isKeySensitive: boolean) => {
    return isKeySensitive ? source[key] : source[key] || source[key.toLocaleLowerCase()];
};
