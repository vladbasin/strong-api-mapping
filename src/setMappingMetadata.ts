import { MappingMetadataType } from './types';
import { MappingMetadataKey } from './models';

export const setMappingMetadata = (data: MappingMetadataType[], target: any) => {
    Reflect.defineMetadata(MappingMetadataKey, data, target);
};
