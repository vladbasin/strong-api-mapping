import { path } from '../../src/decorators';

export class InheritedRequestPayload {
    @path()
    public userId!: number;
}
