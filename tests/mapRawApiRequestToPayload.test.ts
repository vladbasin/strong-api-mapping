import 'reflect-metadata';
import { mapRawApiRequestToPayload } from '../src/mapRawApiRequestToPayload';
import { SampleRequestPayload } from './models';
import { SampleRequestPayloadSchema } from './models/SampleRequestPayloadSchema';

test('maps raw api request correctly', () => {
    const payload = mapRawApiRequestToPayload<SampleRequestPayload>({
        rawApiRequest: {
            pathParams: {
                userId: '2887',
                name: 'prioritized',
            },
            queryParams: {
                name: 'name',
                isAdmin: '1',
                lastname: 'lastName',
            },
            multiValueQueryParams: {
                cars: ['car1', 'car2', 'car3'],
                cash: ['1', '2', '3'],
            },
            body: JSON.stringify({ line1: 'l1', line2: 'l2' }),
            headers: {
                'Content-Type': 'application/json',
            },
            multiValueHeaders: {
                'X-Info': ['key1', 'key2', 'key3'],
            },
        },
        customApiRequestData: {
            context: {
                token: 'token-sample',
                facts: ['first', 'second', 'third'],
                serializedArray: JSON.stringify(['first', 'second', 'third']),
                serializedDetails: JSON.stringify({ line1: 'l1', line2: 'l2' }),
            },
        },
        PayloadConstructor: SampleRequestPayload,
        schema: SampleRequestPayloadSchema,
    });

    expect(payload.userId).toBe(2887);
    expect(payload.id).toBe(2887);
    expect(payload.name).toBe('name');
    expect(payload.prioritizedName).toBe('prioritized');
    expect(payload.isAdmin).toBe(true);
    expect(payload.surname).toBe('lastName');
    expect(payload.cars).toEqual(['car1', 'car2', 'car3']);
    expect(payload.cash).toEqual([1, 2, 3]);
    expect(payload.details).toEqual({ line1: 'l1', line2: 'l2' });
    expect(payload.contentType).toEqual('application/json');
    expect(payload.info).toEqual(['key1', 'key2', 'key3']);
    expect(payload.token).toBe('token-sample');
    expect(payload.tokenKey).toBe('token-sample');
    expect(payload.facts).toEqual(['first', 'second', 'third']);
    expect(payload.factsKey).toEqual(['first', 'second', 'third']);
    expect(payload.serializedArray).toEqual(['first', 'second', 'third']);
    expect(payload.serializedDetails).toEqual({ line1: 'l1', line2: 'l2' });
});
