import { Maybe } from '@vladbasin/ts-types';
import { isNil } from 'lodash';
import { getMappingMetadata, InvalidMappingError, MetadataSources, RawApiRequestType, setKeyCaseBasedValue } from '.';

export const mapPayloadToRawApiRequest = (payload: any): RawApiRequestType => {
    const mappingsMetadata = getMappingMetadata(payload);

    const headers: Record<string, Maybe<string>> = {};
    const queryParams: Record<string, Maybe<string>> = {};
    const pathParams: Record<string, Maybe<string>> = {};
    const multiValueHeaders: Record<string, Maybe<string[]>> = {};
    const multiValueQueryParams: Record<string, Maybe<string[]>> = {};
    let body: Maybe<string>;

    const parametersMultiValueProps = {
        [MetadataSources.query]: 'queryArray',
        [MetadataSources.header]: 'headerArray',
    };

    const parametersMap = {
        [MetadataSources.query]: queryParams,
        [MetadataSources.path]: pathParams,
        [MetadataSources.header]: headers,
        [parametersMultiValueProps[MetadataSources.query]]: multiValueQueryParams,
        [parametersMultiValueProps[MetadataSources.header]]: multiValueHeaders,
    };

    mappingsMetadata.forEach(metadata => {
        switch (metadata.source) {
            case MetadataSources.header:
            case MetadataSources.query:
            case MetadataSources.path:
                if (isNil(metadata.sourceKey)) {
                    throw new InvalidMappingError(
                        `Key is requred for mapping this source (source: "${metadata.source}" property: "${metadata.propName}")`
                    );
                }

                if (metadata.isArray) {
                    if (metadata.source === MetadataSources.path) {
                        throw new InvalidMappingError(
                            `Array is not supported for this source (source: "${metadata.source}" property: "${metadata.propName}")`
                        );
                    }

                    setKeyCaseBasedValue(
                        parametersMap[parametersMultiValueProps[metadata.source]],
                        metadata.sourceKey,
                        metadata.isKeyCaseSensitive,
                        payload[metadata.propName]?.map(t => String(t))
                    );
                } else if (payload[metadata.propName]) {
                    setKeyCaseBasedValue(
                        parametersMap[metadata.source],
                        metadata.sourceKey,
                        metadata.isKeyCaseSensitive,
                        String(payload[metadata.propName])
                    );
                }
                break;
            case MetadataSources.body:
                body = JSON.stringify(payload[metadata.propName]);
                break;
            default:
                throw new InvalidMappingError(
                    `Unsupported source (source: "${metadata.source}", property = "${metadata.propName}")`
                );
        }
    });

    return {
        headers,
        multiValueHeaders,
        body,
        queryParams,
        pathParams,
        multiValueQueryParams,
    };
};
