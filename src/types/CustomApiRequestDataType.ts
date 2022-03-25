import { Maybe, MaybeNullable } from '@vladbasin/ts-types';

export type CustomApiRequestDataType = {
    [key: string]: MaybeNullable<Record<string, Maybe<unknown>>>;
};
