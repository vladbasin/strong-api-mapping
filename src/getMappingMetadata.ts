import { isNil } from 'lodash';
import { MappingMetadataType } from './types';
import { MappingMetadataKey } from './models';

export const getMappingMetadata = (target: any) => {
    return isNil(target) ? [] : (Reflect.getMetadata(MappingMetadataKey, target) as MappingMetadataType[]) || [];
};
