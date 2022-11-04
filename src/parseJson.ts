export const parseJson = (str: unknown) => {
    try {
        return JSON.parse(String(str));
    } catch (e) {
        return undefined;
    }
};
