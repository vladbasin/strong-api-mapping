import { MetadataSources } from '../models';
import { defineDecorator } from '../defineDecorator';
import { ParserType } from '../types';

export const path = (options?: { key?: string; parser?: ParserType }): PropertyDecorator =>
    defineDecorator({ source: MetadataSources.path, useKey: true, isKeyCaseSensitive: false, ...options });
