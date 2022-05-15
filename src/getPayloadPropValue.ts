import { Maybe, MaybeNullable } from '@vladbasin/ts-types';
import { isNil } from 'lodash';
import { getKeyCaseBasedValue, InvalidMappingError } from '.';
import { ParserType } from './types';

export const getPayloadPropValue = (
    parser: ParserType,
    map: MaybeNullable<Record<string, any>>,
    sourceKey: Maybe<string>,
    isKeyCaseSensitive: boolean,
    isArrayValueExpected: boolean
) => {
    const value = !isNil(sourceKey) ? getKeyCaseBasedValue(map || {}, sourceKey, isKeyCaseSensitive) : map;
    const parsedValue = parser(value);

    if (!isNil(parsedValue)) {
        const parsedValueIsArray = parsedValue.constructor.name === 'Array';

        if (parsedValueIsArray && !isArrayValueExpected) {
            throw new InvalidMappingError(
                `Source key ${sourceKey} cannot be mapped: parsed value is array which is not expected`
            );
        }

        if (!parsedValueIsArray && isArrayValueExpected) {
            throw new InvalidMappingError(
                `Source key ${sourceKey} cannot be mapped: parsed value is expected to be array`
            );
        }
    }

    return parsedValue;
};
