import { CodedError, CommonErrorCodes, InnerErrorType } from '@vladbasin/strong-api-models';
import { ObjectSchema } from 'joi';

export const validatePayload = <T>(payload: T, schema: ObjectSchema<T>) => {
    const { error } = schema.validate(payload, { allowUnknown: true, context: payload });

    if (error) {
        const innerErrors: InnerErrorType[] = error.details.map(detail => ({
            code: detail.context?.key || '',
            message: detail.type,
        }));

        throw CodedError.from(error, CommonErrorCodes.validationFailed, innerErrors);
    }

    return payload;
};
