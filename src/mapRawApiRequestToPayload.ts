import { ObjectSchema } from 'joi';
import { isNil } from 'lodash';
import { getMappingMetadata, getPayloadPropValue, InvalidMappingError, MetadataSources, validatePayload } from '.';
import { Newable, RawApiRequestType } from './types';

export const mapRawApiRequestToPayload = <T>(
    rawApiRequest: RawApiRequestType,
    PayloadConstructor: Newable<T>,
    schema: ObjectSchema<T>
) => {
    const payload = new PayloadConstructor();

    const mappingsMetadata = getMappingMetadata(payload);
    const parametersMultiValueProps = {
        [MetadataSources.query]: 'queryArray',
        [MetadataSources.header]: 'headerArray',
    };

    const parametersMap = {
        [MetadataSources.query]: rawApiRequest.queryParams,
        [MetadataSources.path]: rawApiRequest.pathParams,
        [MetadataSources.header]: rawApiRequest.headers,
        [MetadataSources.body]: !isNil(rawApiRequest.body) ? JSON.parse(rawApiRequest.body) : undefined,
        [parametersMultiValueProps[MetadataSources.query]]: rawApiRequest.multiValueQueryParams,
        [parametersMultiValueProps[MetadataSources.header]]: rawApiRequest.multiValueHeaders,
    };
    mappingsMetadata.forEach(metadata => {
        if (metadata.isArray) {
            if (metadata.source === MetadataSources.query || metadata.source === MetadataSources.header) {
                payload[metadata.propName] = getPayloadPropValue(
                    metadata.parser,
                    parametersMap[parametersMultiValueProps[metadata.source]],
                    metadata.sourceKey,
                    metadata.isKeyCaseSensitive
                );
            } else {
                throw new InvalidMappingError('Array mapping is allowed only for query and headers');
            }
        } else {
            payload[metadata.propName] = getPayloadPropValue(
                metadata.parser,
                parametersMap[metadata.source],
                metadata.sourceKey,
                metadata.isKeyCaseSensitive
            );
        }
    });

    return validatePayload(payload, schema);
};
