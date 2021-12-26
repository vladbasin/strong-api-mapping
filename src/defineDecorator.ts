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
    source: MetadataSources;
    useKey: boolean;
    isKeyCaseSensitive: boolean;
    key?: string;
    parser?: ParserType;
}): PropertyDecorator => {
    return (target, key) => {
        const mappings = getMappingMetadata(target);
        const propName = key.toString();
        const propType = Reflect.getMetadata('design:type', target, key);

        let isArray = false;
        let parser = options.parser ?? wrapParserForNilAndBoolValues(propType);

        if (propType.name === 'Array') {
            if (isNil(options.parser)) {
                throw new InvalidMappingError(
                    `Parser is required for array property types (property = ${propName}). It will be used to parse array items`
                );
            }

            isArray = true;

            const nilWrappedParser = wrapParserForNilAndBoolValues(parser);
            parser = (arg: any) => arg?.map(t => nilWrappedParser(t)) || [];
        }

        if (mappings.findIndex(t => t.propName === propName) >= 0) {
            throw new InvalidMappingError(
                `Multiple decorators for the same propery are not supported (property = ${propName})`
            );
        }

        mappings.push({
            propName,
            source: options.source,
            sourceKey: options.useKey ? options.key ?? propName : undefined,
            isKeyCaseSensitive: options.isKeyCaseSensitive,
            isArray,
            parser,
        });

        setMappingMetadata(mappings, target);
    };
};
