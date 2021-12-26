import { CodedError, CommonErrorCodes } from '@vladbasin/strong-api-models';
import { ObjectSchema } from 'joi';

export const validatePayload = <T>(payload: T, schema: ObjectSchema<T>) => {
    const { error } = schema.validate(payload, { allowUnknown: true });

    if (error) {
        throw CodedError.from(error, CommonErrorCodes.validationFailed);
    }

    return payload;
};
