import { MetadataSources } from '../models';
import { defineDecorator } from '../defineDecorator';
import { ParserType } from '../types';

export const query = (options?: { key?: string; parser?: ParserType }): PropertyDecorator =>
    defineDecorator({
        source: MetadataSources.query,
        useKey: true,
        isKeyCaseSensitive: true,
        isCustom: false,
        ...options,
    });
