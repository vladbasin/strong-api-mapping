import { MappingMetadataType } from './types';
import { MappingMetadataKey } from './models';

export const getMappingMetadata = (target: any) => {
    return (Reflect.getMetadata(MappingMetadataKey, target) as MappingMetadataType[]) || [];
};
