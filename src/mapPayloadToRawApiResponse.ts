import { Maybe } from '@vladbasin/ts-types';
import { isNil } from 'lodash';
import { getMappingMetadata, InvalidMappingError, MetadataSources, RawApiResponseType, setKeyCaseBasedValue } from '.';

export const mapPayloadToRawApiResponse = (payload: any): RawApiResponseType => {
    const mappingsMetadata = getMappingMetadata(payload);

    const headers: Record<string, Maybe<string>> = {};
    const multiValueHeaders: Record<string, Maybe<string[]>> = {};
    let body: Maybe<string>;

    mappingsMetadata.forEach(metadata => {
        switch (metadata.source) {
            case MetadataSources.header:
                if (isNil(metadata.sourceKey)) {
                    throw new InvalidMappingError(
                        `Key is requred for mapping headers (property: "${metadata.propName}")`
                    );
                }

                setKeyCaseBasedValue(
                    metadata.isArray ? multiValueHeaders : headers,
                    metadata.sourceKey,
                    metadata.isKeyCaseSensitive,
                    payload[metadata.propName]
                );

                break;
            case MetadataSources.body:
                body = JSON.stringify(payload[metadata.propName]);
                break;
            default:
                throw new InvalidMappingError(
                    `Found "${metadata.source}" for property "${metadata.propName}". Response mapping may contain only headers or body`
                );
        }
    });

    return {
        headers,
        multiValueHeaders,
        body,
    };
};
