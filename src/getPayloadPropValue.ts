import { Maybe, MaybeNullable } from '@vladbasin/ts-types';
import { isNil } from 'lodash';
import { getKeyCaseBasedValue } from '.';
import { ParserType } from './types';

export const getPayloadPropValue = (
    parser: ParserType,
    map: MaybeNullable<Record<string, any>>,
    sourceKey: Maybe<string>,
    isKeyCaseSensitive: boolean
) => {
    const value = !isNil(sourceKey) ? getKeyCaseBasedValue(map || {}, sourceKey, isKeyCaseSensitive) : map;

    return parser(value);
};
