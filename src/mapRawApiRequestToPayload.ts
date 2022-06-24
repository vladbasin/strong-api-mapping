import { ObjectSchema } from 'joi';
import { isNil } from 'lodash';
import { getMappingMetadata, getPayloadPropValue, InvalidMappingError, MetadataSources, validatePayload } from '.';
import { CustomApiRequestDataType, Newable, RawApiRequestType } from './types';

export type MapApiRequestToPayloadOptionsType<T> = {
    rawApiRequest: RawApiRequestType;
    customApiRequestData?: CustomApiRequestDataType;
    PayloadConstructor: Newable<T>;
    schema: ObjectSchema<T>;
};

const arrayNotAllowedSources: string[] = [MetadataSources.body, MetadataSources.path];

export const mapRawApiRequestToPayload = <T>(options: MapApiRequestToPayloadOptionsType<T>) => {
    const { PayloadConstructor, rawApiRequest, schema, customApiRequestData } = options;

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
        if (metadata.isCustom) {
            if (isNil(customApiRequestData)) {
                return;
            }

            payload[metadata.propName] =
                payload[metadata.propName] ||
                getPayloadPropValue(
                    metadata.parser,
                    customApiRequestData[metadata.source],
                    metadata.sourceKey,
                    metadata.isKeyCaseSensitive,
                    metadata.isArray
                );

            return;
        }

        if (metadata.isArray) {
            if (arrayNotAllowedSources.includes(metadata.source)) {
                throw new InvalidMappingError(`Array mapping is not allowed for ${arrayNotAllowedSources.join(', ')}`);
            } else {
                payload[metadata.propName] =
                    payload[metadata.propName] ||
                    getPayloadPropValue(
                        metadata.parser,
                        parametersMap[parametersMultiValueProps[metadata.source]],
                        metadata.sourceKey,
                        metadata.isKeyCaseSensitive,
                        metadata.isArray
                    );
            }
        } else {
            payload[metadata.propName] =
                payload[metadata.propName] ||
                getPayloadPropValue(
                    metadata.parser,
                    parametersMap[metadata.source],
                    metadata.sourceKey,
                    metadata.isKeyCaseSensitive,
                    metadata.isArray
                );
        }
    });

    return validatePayload(payload, schema);
};
