import { MetadataSources } from '../models';
import { defineDecorator } from '../defineDecorator';
import { ParserType } from '../types';

export const header = (options: { key: string; parser?: ParserType; priority?: number }): PropertyDecorator =>
    defineDecorator({
        source: MetadataSources.header,
        useKey: true,
        isKeyCaseSensitive: false,
        key: options.key,
        parser: options.parser,
        isCustom: false,
        priority: options.priority,
    });
