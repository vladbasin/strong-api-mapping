import { ParserType } from '.';
import { MetadataSources } from '../models';

export type MappingMetadataType = {
    propName: string;
    source: MetadataSources;
    sourceKey?: string;
    isKeyCaseSensitive: boolean;
    isArray: boolean;
    parser: ParserType;
};
