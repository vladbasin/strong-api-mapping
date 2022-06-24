import { isNil } from 'lodash';
import { MappingMetadataType } from './types';
import { MappingMetadataKey } from './models';

export const getMappingMetadata = (target: any) => {
    const items = isNil(target) ? [] : (Reflect.getMetadata(MappingMetadataKey, target) as MappingMetadataType[]) || [];

    return items.sort((a, b) => {
        if (a.priority > b.priority) {
            return -1;
        }
        if (a.priority === b.priority) {
            return 0;
        }
        return 1;
    });
};
