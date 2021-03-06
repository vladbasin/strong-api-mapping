import { isNil } from 'lodash';
import {
    ParserType,
    getMappingMetadata,
    InvalidMappingError,
    MetadataSources,
    setMappingMetadata,
    wrapParserForNilAndBoolValues,
} from '.';

export const defineDecorator = (options: {
    isCustom: boolean;
    source: MetadataSources | string;
    useKey: boolean;
    isKeyCaseSensitive: boolean;
    key?: string;
    parser?: ParserType;
    priority?: number;
}): PropertyDecorator => {
    return (target, key) => {
        const mappings = [...getMappingMetadata(target)];
        const propName = key.toString();
        const propType = Reflect.getMetadata('design:type', target, key);

        let isArray = false;
        let parser = wrapParserForNilAndBoolValues(options.parser ?? propType);

        if (propType.name === 'Array') {
            if (isNil(options.parser)) {
                throw new InvalidMappingError(
                    `Parser is required for array property types (property = ${propName}). It will be used to parse array items`
                );
            }

            isArray = true;

            const nilWrappedParser = wrapParserForNilAndBoolValues(parser);
            parser = (arg: any) => {
                if (!isNil(arg) && arg.constructor.name !== 'Array') {
                    const result = nilWrappedParser(arg);

                    if (result.constructor.name !== 'Array') {
                        throw new InvalidMappingError(
                            `Property ${propName} cannot be mapped, because value is not array or specified parser cannot convert it into array`
                        );
                    }

                    return result;
                }

                return arg?.map(t => nilWrappedParser(t)) || [];
            };
        }

        mappings.push({
            isCustom: options.isCustom,
            propName,
            source: options.source,
            sourceKey: options.useKey ? options.key ?? propName : undefined,
            isKeyCaseSensitive: options.isKeyCaseSensitive,
            isArray,
            parser,
            priority: options.priority || 0,
        });

        setMappingMetadata(mappings, target);
    };
};
