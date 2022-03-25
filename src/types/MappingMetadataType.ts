import { ParserType } from '.';
import { MetadataSources } from '../models';

export type MappingMetadataType = {
    propName: string;
    source: MetadataSources | string;
    sourceKey?: string;
    isKeyCaseSensitive: boolean;
    isArray: boolean;
    isCustom: boolean;
    parser: ParserType;
};
