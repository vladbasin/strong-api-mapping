import { ObjectSchema } from 'joi';
import { isNil } from 'lodash';
import { getMappingMetadata, InvalidMappingError, MetadataSources, getPayloadPropValue, validatePayload } from '.';
import { Newable, RawApiResponseType } from './types';

export const mapRawApiResponseToPayload = <T>(
    rawApiResponse: RawApiResponseType,
    PayloadConstructor: Newable<T>,
    schema: ObjectSchema<T>
) => {
    const payload = new PayloadConstructor();

    const mappingsMetadata = getMappingMetadata(payload);

    mappingsMetadata.forEach(metadata => {
        switch (metadata.source) {
            case MetadataSources.header:
                if (isNil(metadata.sourceKey)) {
                    throw new InvalidMappingError(
                        `Key is requred for mapping headers (property: "${metadata.propName}")`
                    );
                }

                payload[metadata.propName] = getPayloadPropValue(
                    metadata.parser,
                    metadata.isArray ? rawApiResponse.multiValueHeaders : rawApiResponse.headers,
                    metadata.sourceKey,
                    metadata.isKeyCaseSensitive
                );

                break;
            case MetadataSources.body:
                payload[metadata.propName] = !isNil(rawApiResponse.body) ? JSON.parse(rawApiResponse.body) : undefined;
                break;
            default:
                throw new InvalidMappingError(
                    `Found "${metadata.source}" for property "${metadata.propName}". Response mapping may contain only headers or body`
                );
        }
    });

    return validatePayload(payload, schema);
};
