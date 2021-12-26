import { MetadataSources } from '../models';
import { defineDecorator } from '..';

export const body = (): PropertyDecorator =>
    defineDecorator({ source: MetadataSources.body, useKey: false, isKeyCaseSensitive: false });
