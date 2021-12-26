# Strong API mapping

Strongly typed API models. Mapping & validation. Use meaningful decorators. Don't repeat yourself.

## Installation

### npm

`npm install reflect-metadata  @vladbasin/strong-api-mapping`

### yarn

`yarn add reflect-metadata @vladbasin/strong-api-mapping`

## Usage

This is a generic mapping library. You can integrate it with any HTTP stack. Currently the following packages use this library:

- [@vladbasin/strong-api-middleware](https://github.com/vladbasin/strong-api-middleware) - generic middleware library which can integrate with any HTTP stack, by introducing additional layers of request/response pipeline and with help of this library can support any HTTP stack.
- [@vladbasin/strong-api-middleware-aws-lambda](https://github.com/vladbasin/strong-api-middleware) - complete e2e HTTP pipeline integration for AWS Lambda
- [@vladbasin/strong-api-middleware-express]() - IN PROGRESS - complete e2e HTTP pipeline integration for express server
- [@vladbasin/strong-api-client](https://github.com/vladbasin/strong-api-client) - HTTP client which can use shared models to execute request. Therefore, no need to duplicate mapping & validation logic for API consumers & producers. 

### Step-by-step guide

1. Import `reflect-metadata` ONCE in your index file:

```typescript
import 'reflect-metadata';
```

2. Define your model

```typescript
import { body, header, path, query } from '@vladbasin/strong-api-mapping';

export class RequestPayload {
    @path()
    public userId!: number;

    @path({ key: 'userId' })
    public id!: number;

    @query()
    public name!: string;

    @query()
    public isAdmin!: boolean;

    @query({ key: 'lastname' })
    public surname!: string;

    @query({ parser: String })
    public cars!: string[];

    @query({ parser: Number })
    public cash!: number[];

    @body()
    public details!: DetailsType;

    @header({ key: 'Content-Type' })
    public contentType!: string;

    @header({ key: 'X-Info', parser: String })
    public info!: string[];
}
```

3. Define validation rules with `Joi`

```typescript
export const RequestPayloadSchema = Joi.object<RequestPayload>({
    surname: Joi.string().min(10),
    cars: Joi.array().max(3),
    // other rules for field content...
});
```

4. Prepare `RawApiRequest` for mapping.
For example, [@vladbasin/strong-api-middleware-aws-lambda](https://github.com/vladbasin/strong-api-middleware) already does it for you for AWS Lambda. But you can create your own middleware for your stack and use this library to do mapping & validation for you.

```typescript
// represents Query, Header, Route and Body values for HTTP request
export type RawApiRequestType = {
    queryParams?: MaybeNullable<Record<string, Maybe<string>>>;
    multiValueQueryParams?: MaybeNullable<Record<string, Maybe<string[]>>>;
    pathParams?: MaybeNullable<Record<string, Maybe<string>>>;
    headers?: MaybeNullable<Record<string, Maybe<string>>>;
    multiValueHeaders?: MaybeNullable<Record<string, Maybe<string[]>>>;
    body?: MaybeNullable<string>;
};
```

1. Call the following methods to map HTTP request to your model and vice versa with DRY principle

```typescript
// maps RawApiRequest to Model (RequestPayload) and validates it (throws `CodedError` with information if model is not valid)
mapRawApiRequestToPayload(rawApiRequest, RequestPayload, RequestPayloadSchema);

// maps Model (RequestPayload) to RawApiRequest
mapPayloadToRawApiRequest(requestPayload);
```

Also applicable to **response** models (`mapRawApiResponseToPayload()`, `mapPayloadToRawApiResponse()`).

Thus, you can share request/response models with your API consumers, so they don't need to repeat the same mapping & validation logic. See: [@vladbasin/strong-api-client](https://github.com/vladbasin/strong-api-client)