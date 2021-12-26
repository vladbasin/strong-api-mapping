import { Maybe, MaybeNullable } from '@vladbasin/ts-types';

export type RawApiResponseType = {
    headers?: MaybeNullable<Record<string, Maybe<string>>>;
    multiValueHeaders?: MaybeNullable<Record<string, Maybe<string[]>>>;
    body?: MaybeNullable<string>;
};
