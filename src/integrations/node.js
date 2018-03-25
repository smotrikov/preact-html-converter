import { BaseConverter, baseConvertStatic } from '../base-converter';
import parser from '../parser/node';

export const PreactHTMLConverter = () => BaseConverter(parser);
export const convertStatic = htmlString => baseConvertStatic(htmlString, parser);
