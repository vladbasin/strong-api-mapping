import { defineDecorator, ParserType } from '../../src';

export const context = (options: { key?: string; parser?: ParserType }): PropertyDecorator =>
    defineDecorator({
        source: 'context',
        useKey: true,
        isKeyCaseSensitive: false,
        key: options.key,
        parser: options.parser,
        isCustom: true,
    });
