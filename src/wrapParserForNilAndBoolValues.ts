import { isNil } from 'lodash';
import { ParserType } from '.';

export const wrapParserForNilAndBoolValues = (parser: ParserType) => (arg: any) => {
    let targetParser = parser;

    if (parser.name === 'Boolean') {
        targetParser = (targetArg: any) => !!(targetArg === 'true' || targetArg === true || targetArg === '1');
    }

    return isNil(arg) ? arg : targetParser(arg);
};
