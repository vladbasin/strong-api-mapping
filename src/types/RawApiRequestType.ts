import { Maybe, MaybeNullable } from '@vladbasin/ts-types';

export type RawApiRequestType = {
    queryParams?: MaybeNullable<Record<string, Maybe<string>>>;
    multiValueQueryParams?: MaybeNullable<Record<string, Maybe<string[]>>>;
    pathParams?: MaybeNullable<Record<string, Maybe<string>>>;
    headers?: MaybeNullable<Record<string, Maybe<string>>>;
    multiValueHeaders?: MaybeNullable<Record<string, Maybe<string[]>>>;
    body?: MaybeNullable<string>;
};
