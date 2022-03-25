import { context } from '../decorators';
import { body, header, path, query } from '../../src/decorators';
import { DetailsType } from './types/DetailsType';

export class SampleRequestPayload {
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

    @context({ parser: String })
    public token!: string;

    @context({ key: 'token', parser: String })
    public tokenKey!: string;

    @context({ parser: String })
    public facts!: string[];

    @context({ key: 'facts', parser: String })
    public factsKey!: string[];

    @context({ parser: JSON.parse })
    public serializedArray!: string[];

    @context({ parser: JSON.parse })
    public serializedDetails!: DetailsType;
}
